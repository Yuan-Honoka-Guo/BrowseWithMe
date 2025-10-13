// Background service worker for Browse With Me extension
// Handles AI API interactions and browsing context storage

let browsingHistory = [];
let currentTask = '';

// Initialize AI capabilities check
async function checkAICapabilities() {
  const capabilities = {
    summarizer: 'unknown',
    writer: 'unknown',
    languageDetector: 'unknown'
  };

  try {
    // Check Summarizer API (accessed as global object)
    if (typeof self.ai !== 'undefined' && 'summarizer' in self.ai) {
      const canSummarize = await self.ai.summarizer.capabilities();
      capabilities.summarizer = canSummarize.available;
    } else {
      capabilities.summarizer = 'no';
    }

    // Check Writer API (accessed as global object)
    if (typeof self.ai !== 'undefined' && 'writer' in self.ai) {
      const canWrite = await self.ai.writer.capabilities();
      capabilities.writer = canWrite.available;
    } else {
      capabilities.writer = 'no';
    }

    // Check Language Detector API (accessed as global object)
    if (typeof self.ai !== 'undefined' && 'languageDetector' in self.ai) {
      const canDetect = await self.ai.languageDetector.capabilities();
      capabilities.languageDetector = canDetect.available;
    } else {
      capabilities.languageDetector = 'no';
    }
  } catch (error) {
    console.error('Error checking AI capabilities:', error);
  }

  return capabilities;
}

// Trigger AI model download (requires user activation)
async function downloadAIModel(apiType = 'summarizer') {
  try {
    let result = { success: false, message: '' };

    // Check if AI is available at all
    if (typeof self.ai === 'undefined') {
      result.message = 'Chrome AI APIs are not available. Please ensure you have enabled the required flags in chrome://flags and are using Chrome 138+';
      return result;
    }

    if (apiType === 'summarizer' && 'summarizer' in self.ai) {
      const capabilities = await self.ai.summarizer.capabilities();

      if (capabilities.available === 'no') {
        result.message = 'Summarizer API not supported on this device';
        return result;
      }

      if (capabilities.available === 'after-download') {
        result.message = 'Model needs to be downloaded. Starting download...';

        // Creating a session will trigger the download (requires user activation)
        const summarizer = await self.ai.summarizer.create();
        summarizer.destroy();

        result.success = true;
        result.message = 'Model download started. This may take several minutes.';
        return result;
      }

      if (capabilities.available === 'readily') {
        result.success = true;
        result.message = 'Model already available';
        return result;
      }
    }

    if (apiType === 'writer' && 'writer' in self.ai) {
      const capabilities = await self.ai.writer.capabilities();

      if (capabilities.available === 'no') {
        result.message = 'Writer API not supported on this device';
        return result;
      }

      if (capabilities.available === 'after-download') {
        result.message = 'Model needs to be downloaded. Starting download...';

        const writer = await self.ai.writer.create();
        writer.destroy();

        result.success = true;
        result.message = 'Model download started. This may take several minutes.';
        return result;
      }

      if (capabilities.available === 'readily') {
        result.success = true;
        result.message = 'Model already available';
        return result;
      }
    }

    result.message = 'Unknown API type or API not available';
    return result;
  } catch (error) {
    console.error('Error downloading model:', error);
    return { success: false, message: error.message };
  }
}

// Summarize page content
async function summarizeContent(text, type = 'tldr') {
  try {
    if (typeof self.ai === 'undefined' || !('summarizer' in self.ai)) {
      return { error: 'Summarizer API not available. Please enable the required flags in chrome://flags' };
    }

    const canSummarize = await self.ai.summarizer.capabilities();

    if (canSummarize.available === 'no') {
      return { error: 'Summarizer API not supported on this device' };
    }

    if (canSummarize.available === 'after-download') {
      return { error: 'AI model needs to be downloaded first. Click the "Download AI Model" button.' };
    }

    const summarizer = await self.ai.summarizer.create({
      type: type,
      format: 'markdown',
      length: 'medium'
    });

    const summary = await summarizer.summarize(text, {
      context: currentTask ? `User's current task: ${currentTask}` : ''
    });

    summarizer.destroy();
    return { summary };
  } catch (error) {
    console.error('Error summarizing:', error);
    return { error: error.message };
  }
}

// Generate suggestions using Writer API
async function generateSuggestion(pageContext) {
  try {
    if (typeof self.ai === 'undefined' || !('writer' in self.ai)) {
      return { error: 'Writer API not available. Please enable the required flags in chrome://flags' };
    }

    const canWrite = await self.ai.writer.capabilities();

    if (canWrite.available === 'no') {
      return { error: 'Writer API not supported on this device' };
    }

    if (canWrite.available === 'after-download') {
      return { error: 'AI model needs to be downloaded first. Click the "Download AI Model" button.' };
    }

    const writer = await self.ai.writer.create({
      tone: 'casual',
      format: 'plain-text',
      length: 'short'
    });

    const prompt = `Based on this page content: ${pageContext.substring(0, 500)}...\n\n${currentTask ? `User's task: ${currentTask}\n\n` : ''}Generate a helpful or humorous suggestion about this page.`;

    const suggestion = await writer.write(prompt);

    writer.destroy();
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
  const stored = await chrome.storage.local.get(['browsingHistory', 'currentTask']);
  if (stored.browsingHistory) {
    browsingHistory = stored.browsingHistory;
  }
  if (stored.currentTask) {
    currentTask = stored.currentTask;
  }
  return { browsingHistory, currentTask };
}

// Update current task
async function updateCurrentTask(task) {
  currentTask = task;
  await chrome.storage.local.set({ currentTask });
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
          }
          sendResponse(summaryResult);
          break;

        case 'generateSuggestion':
          const suggestionResult = await generateSuggestion(request.pageContext);
          sendResponse(suggestionResult);
          break;

        case 'getContext':
          const context = await getBrowsingContext();
          sendResponse(context);
          break;

        case 'updateTask':
          await updateCurrentTask(request.task);
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

// Initialize on installation
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Browse With Me extension installed');
  const capabilities = await checkAICapabilities();
  console.log('AI capabilities:', capabilities);
});
