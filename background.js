// Background service worker for Browse With Me extension
// Handles AI API interactions and browsing context storage

let browsingHistory = [];
let currentTask = '';
let downloadProgressPorts = []; // Ports for sending progress updates to popup
let pageResults = {}; // Store summaries and suggestions per URL: { url: { summary, suggestion, timestamp } }

// Initialize AI capabilities check
async function checkAICapabilities() {
  const capabilities = {
    Summarizer: 'unknown',
    LanguageModel: 'unknown',
    LanguageDetector: 'unknown'
  };

  try {
    for (const api of ['Summarizer', 'LanguageModel', 'LanguageDetector']) {
      if (!(api in self)) {
        capabilities[api] = 'unsupported';
      } else {
        const availability = await self[api].availability();
        capabilities[api] = availability;
      }
    }
  } catch (error) {
    console.error('Error checking AI capabilities:', error);
  }

  return capabilities;
}

// Trigger AI model download (requires user activation)
async function downloadAIModel(apiType = 'Summarizer') {
  try {
    let result = { success: false, message: '' };

    // Check if API is available at all
    if (!(apiType in self)) {
      result.message = 'Chrome ' + apiType + ' API is not available. Please enable required flags in chrome://flags';
      return result;
    }

    if (apiType === 'Summarizer') {
      const availability = await Summarizer.availability();

      if (availability === 'available') {
        result.message = 'Summarizer model is already downloaded and available.';
        return result;
      }

      if (availability === 'downloadable') {
        result.message = 'Model needs to be downloaded. Starting download...';

        // Creating a session will trigger the download (requires user activation)
        const summarizer = await Summarizer.create({
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              const progress = Math.round(e.loaded * 100);
              console.log(`Downloaded ${progress}%`);

              // Broadcast progress to all connected popups
              downloadProgressPorts.forEach(port => {
                try {
                  port.postMessage({
                    type: 'downloadProgress',
                    progress: progress,
                    loaded: e.loaded,
                    total: e.total || 1
                  });
                } catch (err) {
                  console.error('Error sending progress:', err);
                }
              });
            });
          }
        });
        summarizer.destroy();

        // Send completion message
        downloadProgressPorts.forEach(port => {
          try {
            port.postMessage({
              type: 'downloadComplete',
              progress: 100
            });
          } catch (err) {
            console.error('Error sending completion:', err);
          }
        });

        result.success = true;
        result.message = 'Summarizer model download completed successfully!';
        return result;
      }

      result.message = 'Summarizer is not available on this device.';
      return result;
    }

    if (apiType === 'LanguageModel') {
      const availability = await LanguageModel.availability();

      if (availability === 'available') {
        result.success = true;
        result.message = 'LanguageModel is already downloaded and available.';
        return result;
      }

      if (availability === 'downloadable') {
        result.message = 'LanguageModel needs to be downloaded. Starting download...';

        // Creating a session will trigger the download (requires user activation)
        const session = await LanguageModel.create({
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              const progress = Math.round(e.loaded * 100);
              console.log(`Downloaded ${progress}%`);

              // Broadcast progress to all connected popups
              downloadProgressPorts.forEach(port => {
                try {
                  port.postMessage({
                    type: 'downloadProgress',
                    progress: progress,
                    loaded: e.loaded,
                    total: e.total || 1
                  });
                } catch (err) {
                  console.error('Error sending progress:', err);
                }
              });
            });
          }
        });
        session.destroy();

        // Send completion message
        downloadProgressPorts.forEach(port => {
          try {
            port.postMessage({
              type: 'downloadComplete',
              progress: 100
            });
          } catch (err) {
            console.error('Error sending completion:', err);
          }
        });

        result.success = true;
        result.message = 'LanguageModel download completed successfully!';
        return result;
      }

      result.message = 'LanguageModel is not available on this device.';
      return result;
    }

    result.message = 'Unknown API type: ' + apiType;
    return result;
  } catch (error) {
    console.error('Error downloading model:', error);
    return { success: false, message: error.message };
  }
}

// Extract page content from tab (with fallback injection)
async function getPageContent(tabId) {
  try {
    // Try to send message to existing content script first
    const response = await chrome.tabs.sendMessage(tabId, { action: 'getPageContent' });
    return { content: response.content };
  } catch (error) {
    // Content script not loaded, inject it programmatically
    console.log('Content script not found, injecting...');

    try {
      // Inject the content script
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });

      // Wait a moment for script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Try again to get content
      const response = await chrome.tabs.sendMessage(tabId, { action: 'getPageContent' });
      return { content: response.content };
    } catch (injectError) {
      console.error('Failed to inject content script:', injectError);
      return { error: 'Cannot access this page. Content scripts are not allowed on chrome:// pages or extension pages.' };
    }
  }
}

// Summarize page - extracts content and summarizes
async function summarizePage(tabId, type = 'tldr', url, title) {
  console.log("background.js: summarizePage called for tab", tabId);

  // Extract page content
  const contentResult = await getPageContent(tabId);
  if (contentResult.error) {
    return { error: contentResult.error };
  }
  
  if (!contentResult.content) {
    return { error: 'Could not extract page content' };
  }
  console.log("Extracted content length:", contentResult.content.length);
  // Summarize the content
  return await summarizeContent(contentResult.content, type, url, title);
}

// Summarize page content
async function summarizeContent(text, type = 'tldr', url, title) {
  console.log("background.js: summarizeContent called");
  try {
    if (!('Summarizer' in self)) {
      return { error: 'Summarizer API not downloaded or not supported if you have downloaded that.' };
    }

    const availability = await Summarizer.availability();
    if (availability === 'unavailable') {
      return { error: 'Summarizer API is unavailable.' };
    }

    const summarizer = await Summarizer.create();
    const summary = await summarizer.summarize(text);
    summarizer.destroy();
    return { summary };
  } catch (error) {
    console.error('Error summarizing:', error);
    return { error: error.message };
  }
}

// Generate suggestions using Prompter API
async function generateSuggestion(pageContext, specialInstructions = null) {
  const { browsingHistory, currentTask } = await getBrowsingContext();
  console.log("Generating suggestion with current task:", currentTask);

  try {
    // Check if LanguageModel API is available
    if (!('LanguageModel' in self)) {
      return { error: 'LanguageModel API not available. Please enable chrome://flags/#optimization-guide-on-device-model' };
    }

    // Check availability status
    const availability = await LanguageModel.availability();

    if (availability === 'unavailable') {
      return { error: 'LanguageModel API not supported on this device' };
    }

    if (availability === 'downloadable') {
      return { error: 'AI model needs to be downloaded first. Click the "Download AI Model" button.' };
    }

    // Create a session with system prompt
    const session = await LanguageModel.create({
      // initialPrompt: [{ role: 'system', content: 'You are a helpful and friendly assistant.'}],
      temperature: 0.8,
      topK: 3
    });

    // Build the prompt with context
    let prompt = `You are a helpful and occasionally humorous browsing assistant. Provide concise, useful suggestions about web pages in 1-2 sentences.' \n\n Based on this page content:\n${pageContext}...`;

    if (browsingHistory && browsingHistory.length > 0) {
      const recentPages = browsingHistory.slice(-3).map(page => page.title || page.url).join(', ');
      prompt += `\n\nContext - Recent pages: ${recentPages}`;
    }

    if (currentTask) {
      prompt += `\n\nUser's current task: ${currentTask}`;
    } else if (specialInstructions) {
      prompt += `\n\nUser's instructions: ${specialInstructions}`;
    } else {
      prompt += '\n\nGenerate a helpful suggestion about this page.';
    }

    prompt += '\n\n Return plain text with CRLF for user only.'

    // Get the suggestion from the model
    const suggestion = await session.prompt(prompt);

    // Clean up the session
    session.destroy();

    return { suggestion };
  } catch (error) {
    console.error('Error generating suggestion:', error);
    return { error: error.message };
  }
}

// Store browsing context
async function storeBrowsingContext(pageInfo) {
  browsingHistory.push({
    url: pageInfo.url,
    title: pageInfo.title,
    summary: pageInfo.summary,
    timestamp: Date.now()
  });

  // Keep only last 10 pages
  if (browsingHistory.length > 10) {
    browsingHistory.shift();
  }

  // Save to chrome.storage
  await chrome.storage.local.set({ browsingHistory });
}

// Get browsing context
async function getBrowsingContext() {
  const stored = await chrome.storage.local.get(['browsingHistory', 'currentTask', 'pageResults']);
  if (stored.browsingHistory) {
    browsingHistory = stored.browsingHistory;
  }
  if (stored.currentTask) {
    currentTask = stored.currentTask;
  }
  if (stored.pageResults) {
    pageResults = stored.pageResults;
  }
  return { browsingHistory, currentTask };
}

// Store page results (summary and/or suggestion)
async function storePageResult(url, resultType, resultData) {
  if (!pageResults[url]) {
    pageResults[url] = { timestamp: Date.now() };
  }

  pageResults[url][resultType] = resultData;
  pageResults[url].timestamp = Date.now();

  // Save to chrome.storage
  await chrome.storage.local.set({ pageResults });
}

// Get page results for a specific URL
async function getPageResult(url) {
  const stored = await chrome.storage.local.get(['pageResults']);
  if (stored.pageResults && stored.pageResults[url]) {
    return stored.pageResults[url];
  }
  return null;
}

// Update current task
async function updateCurrentTask(task) {
  currentTask = task;
  await chrome.storage.local.set({ currentTask });
}

// Clear all history and stored results
async function clearAllHistory() {
  browsingHistory = [];
  pageResults = {};
  await chrome.storage.local.set({
    browsingHistory: [],
    pageResults: {}
  });
}

// Message handler
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case 'checkCapabilities':
          const capabilities = await checkAICapabilities();
          sendResponse(capabilities);
          break;

        case 'downloadModel':
          const downloadResult = await downloadAIModel(request.apiType || 'summarizer');
          sendResponse(downloadResult);
          break;

        case 'summarize':
          const summaryResult = await summarizeContent(request.text, request.type);
          if (!summaryResult.error) {
            await storeBrowsingContext({
              url: request.url,
              title: request.title,
              summary: summaryResult.summary
            });
            // Store the summary for this page
            await storePageResult(request.url, 'summary', summaryResult.summary);
          }
          sendResponse(summaryResult);
          break;

        case 'summarizePage':
          // Extract content and summarize in background
          const pageResult = await summarizePage(request.tabId, request.type, request.url, request.title);
          if (!pageResult.error) {
            await storeBrowsingContext({
              url: request.url,
              title: request.title,
              summary: pageResult.summary
            });
            // Store the summary for this page
            await storePageResult(request.url, 'summary', pageResult.summary);
          }
          sendResponse(pageResult);
          break;

        case 'generateSuggestion':
          const suggestionResult = await generateSuggestion(request.pageContext, request.specialInstructions);
          if (!suggestionResult.error) {
            // Store the suggestion for this page
            await storePageResult(request.url, 'suggestion', suggestionResult.suggestion);
          }
          sendResponse(suggestionResult);
          break;

        case 'getPageResult':
          const result = await getPageResult(request.url);
          sendResponse(result || {});
          break;

        case 'getContext':
          const context = await getBrowsingContext();
          sendResponse(context);
          break;

        case 'updateTask':
          await updateCurrentTask(request.task);
          sendResponse({ success: true });
          break;

        case 'clearAllHistory':
          await clearAllHistory();
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ error: error.message });
    }
  })();

  return true; // Keep message channel open for async response
});

// Handle long-lived connections for progress updates
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'downloadProgress') {
    downloadProgressPorts.push(port);
    console.log('Popup connected for progress updates');

    port.onDisconnect.addListener(() => {
      const index = downloadProgressPorts.indexOf(port);
      if (index > -1) {
        downloadProgressPorts.splice(index, 1);
      }
      console.log('Popup disconnected from progress updates');
    });
  }
});

// Initialize on installation
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Browse With Me extension installed');
  const capabilities = await checkAICapabilities();
  console.log('AI capabilities:', capabilities);
});
