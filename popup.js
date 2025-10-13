// Popup script for Browse With Me extension

let currentTab = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;

  // Check AI capabilities
  await checkAIStatus();

  // Load current task
  await loadCurrentTask();

  // Load browsing history
  await loadBrowsingHistory();

  // Load previous results for this page (if any)
  await loadPreviousResults();

  // Setup event listeners
  setupEventListeners();
});

// Check AI API status
async function checkAIStatus() {
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-text');
  const downloadBtn = document.getElementById('downloadModelBtn');

  try {
    const response = await chrome.runtime.sendMessage({ action: 'checkCapabilities' });

    // Check if any API is readily available
    const isReady = response.Summarizer === 'available';

    // Check if download is needed
    const needsDownload = response.Summarizer === 'downloadable';

    // Check if APIs are unsupported
    const isUnsupported = response.Summarizer === 'unsupported';

    if (isReady) {
      statusDot.classList.add('ready');
      statusText.textContent = 'AI Ready';
      downloadBtn.style.display = 'none';
    } else if (needsDownload) {
      statusDot.classList.remove('ready');
      statusText.textContent = 'AI Model needs to be downloaded';
      downloadBtn.style.display = 'block';
    } else if (isUnsupported) {
      statusDot.classList.add('error');
      statusText.textContent = 'AI APIs not available on this device';
      downloadBtn.style.display = 'none';
    } else {
      statusDot.classList.add('error');
      statusText.textContent = 'AI status unknown';
    }
  } catch (error) {
    statusDot.classList.add('error');
    statusText.textContent = 'Error checking AI status';
    console.error('Error checking AI status:', error);
  }
}

// Load current task from storage
async function loadCurrentTask() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getContext' });
    if (response.currentTask) {
      document.getElementById('taskInput').value = response.currentTask;
    }
  } catch (error) {
    console.error('Error loading task:', error);
  }
}

// Load browsing history
async function loadBrowsingHistory() {
  const historyContainer = document.getElementById('historyContainer');

  try {
    const response = await chrome.runtime.sendMessage({ action: 'getContext' });

    if (response.browsingHistory && response.browsingHistory.length > 0) {
      historyContainer.innerHTML = '';
      response.browsingHistory.reverse().forEach(item => {
        const historyItem = createHistoryItem(item);
        historyContainer.appendChild(historyItem);
      });
    } else {
      historyContainer.innerHTML = '<p class="placeholder">No browsing history yet</p>';
    }
  } catch (error) {
    console.error('Error loading history:', error);
    historyContainer.innerHTML = '<p class="error">Error loading history</p>';
  }
}

// Load previous results for current page
async function loadPreviousResults() {
  const summaryContainer = document.getElementById('summaryContainer');
  const suggestionsContainer = document.getElementById('suggestionsContainer');

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'getPageResult',
      url: currentTab.url
    });

    if (response) {
      // Restore summary if it exists
      if (response.summary) {
        summaryContainer.innerHTML = `<p class="summary-text">${response.summary}</p>`;
      }

      // Restore suggestion if it exists
      if (response.suggestion) {
        suggestionsContainer.innerHTML = `<p class="suggestion-text">${response.suggestion}</p>`;
      }
    }
  } catch (error) {
    console.error('Error loading previous results:', error);
  }
}

// Create history item element
function createHistoryItem(item) {
  const div = document.createElement('div');
  div.className = 'history-item';

  const title = document.createElement('div');
  title.className = 'history-item-title';
  title.textContent = item.title || 'Untitled';

  const url = document.createElement('div');
  url.className = 'history-item-url';
  url.textContent = item.url;

  const time = document.createElement('div');
  time.className = 'history-item-time';
  time.textContent = formatTime(item.timestamp);

  div.appendChild(title);
  div.appendChild(url);

  if (item.summary) {
    const summary = document.createElement('div');
    summary.className = 'history-item-summary';
    summary.textContent = item.summary.substring(0, 100) + (item.summary.length > 100 ? '...' : '');
    div.appendChild(summary);
  }

  div.appendChild(time);

  return div;
}

// Format timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  return date.toLocaleDateString();
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('updateTaskBtn').addEventListener('click', updateTask);
  document.getElementById('analyzePageBtn').addEventListener('click', analyzePage);
  document.getElementById('summarizeBtn').addEventListener('click', summarizePage);
  document.getElementById('refreshHistoryBtn').addEventListener('click', loadBrowsingHistory);
  document.getElementById('clearHistoryBtn').addEventListener('click', clearAllHistory);
  document.getElementById('downloadModelBtn').addEventListener('click', downloadModel);
}

// Download AI model (requires user activation)
async function downloadModel() {
  const downloadBtn = document.getElementById('downloadModelBtn');
  const downloadStatus = document.getElementById('downloadStatus');
  const downloadProgress = document.getElementById('downloadProgress');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressPercentage = document.querySelector('.progress-percentage');

  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Downloading...';
  downloadBtn.style.display = 'none';
  downloadStatus.style.display = 'none';
  downloadProgress.style.display = 'block';

  // Connect to background for progress updates
  const port = chrome.runtime.connect({ name: 'downloadProgress' });

  port.onMessage.addListener((message) => {
    if (message.type === 'downloadProgress') {
      const progress = message.progress || 0;
      progressBarFill.style.width = `${progress}%`;
      progressPercentage.textContent = `${progress}%`;
      console.log('Download progress:', progress + '%');
    } else if (message.type === 'downloadComplete') {
      progressBarFill.style.width = '100%';
      progressPercentage.textContent = '100%';

      // Show success message after a short delay
      setTimeout(() => {
        downloadProgress.style.display = 'none';
        downloadStatus.style.display = 'block';
        downloadStatus.className = 'download-status success';
        downloadStatus.textContent = 'Model download completed successfully! You can now use the AI features.';

        // Refresh AI status
        setTimeout(async () => {
          await checkAIStatus();
        }, 2000);
      }, 1000);
    }
  });

  port.onDisconnect.addListener(() => {
    console.log('Disconnected from progress updates');
  });

  try {
    // Start the download (this will trigger progress updates via the port)
    const result = await chrome.runtime.sendMessage({
      action: 'downloadModel',
      apiType: 'Summarizer'
    });

    if (!result.success) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error downloading model:', error);
    downloadProgress.style.display = 'none';
    downloadStatus.style.display = 'block';
    downloadStatus.className = 'download-status error';
    downloadStatus.textContent = `Error: ${error.message}. Please ensure you have enabled the required flags in chrome://flags and have enough storage space.`;
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Retry Download';
    downloadBtn.style.display = 'block';
    port.disconnect();
  }
}

// Update current task
async function updateTask() {
  const taskInput = document.getElementById('taskInput');
  const task = taskInput.value.trim();
  const updateBtn = document.getElementById('updateTaskBtn');

  updateBtn.disabled = true;
  updateBtn.textContent = 'Updating...';
  console.log('Updating task to:', task);
  try {
    await chrome.runtime.sendMessage({
      action: 'updateTask',
      task: task
    });
    updateBtn.textContent = 'Updated!';
    setTimeout(() => {
      updateBtn.textContent = 'Update Task';
      updateBtn.disabled = false;
    }, 1500);
  } catch (error) {
    console.error('Error updating task:', error);
    updateBtn.textContent = 'Error';
    updateBtn.disabled = false;
  }
}

// Analyze current page
async function analyzePage() {
  const suggestionsContainer = document.getElementById('suggestionsContainer');
  const analyzeBtn = document.getElementById('analyzePageBtn');

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing...';
  suggestionsContainer.innerHTML = '<p class="loading">Analyzing page content...</p>';

  try {
    // Get page content from content script
    const response = await chrome.tabs.sendMessage(currentTab.id, { action: 'getPageContent' });

    if (!response || !response.content) {
      throw new Error('Could not extract page content');
    }

    // Generate suggestion
    const result = await chrome.runtime.sendMessage({
      action: 'generateSuggestion',
      pageContext: response.content,
      url: currentTab.url
    });

    if (result.error) {
      throw new Error(result.error);
    }

    suggestionsContainer.innerHTML = `<p class="suggestion-text">${result.suggestion}</p>`;
  } catch (error) {
    console.error('Error analyzing page:', error);
    suggestionsContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  } finally {
    analyzeBtn.textContent = 'Analyze Page';
    analyzeBtn.disabled = false;
  }
}

// Summarize current page
async function summarizePage() {
  const summaryContainer = document.getElementById('summaryContainer');
  const summarizeBtn = document.getElementById('summarizeBtn');
  const summaryType = document.getElementById('summaryType').value;

  summarizeBtn.disabled = true;
  summarizeBtn.textContent = 'Summarizing...';
  summaryContainer.innerHTML = '<p class="loading">Generating summary...</p>';

  try {
    // Let background handle content extraction and summarization
    const result = await chrome.runtime.sendMessage({
      action: 'summarizePage',
      tabId: currentTab.id,
      type: summaryType,
      url: currentTab.url,
      title: currentTab.title
    });

    if (result.error) {
      throw new Error(result.error);
    }

    summaryContainer.innerHTML = `<p class="summary-text">${result.summary}</p>`;

    // Refresh history to show new entry
    await loadBrowsingHistory();
  } catch (error) {
    console.error('Error summarizing page:', error);
    summaryContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  } finally {
    summarizeBtn.textContent = 'Summarize';
    summarizeBtn.disabled = false;
  }
}

// Clear all history
async function clearAllHistory() {
  const clearBtn = document.getElementById('clearHistoryBtn');

  // Confirm with user
  if (!confirm('Are you sure you want to clear all browsing history and stored results? This cannot be undone.')) {
    return;
  }

  clearBtn.disabled = true;
  clearBtn.textContent = 'Clearing...';

  try {
    await chrome.runtime.sendMessage({
      action: 'clearAllHistory'
    });

    // Clear current display
    document.getElementById('historyContainer').innerHTML = '<p class="placeholder">No browsing history yet</p>';
    document.getElementById('summaryContainer').innerHTML = '<p class="placeholder">No summary yet</p>';
    document.getElementById('suggestionsContainer').innerHTML = '<p class="placeholder">Click "Analyze Page" to get AI-powered insights</p>';

    clearBtn.textContent = 'Cleared!';
    setTimeout(() => {
      clearBtn.textContent = 'Clear All';
      clearBtn.disabled = false;
    }, 1500);
  } catch (error) {
    console.error('Error clearing history:', error);
    clearBtn.textContent = 'Error';
    setTimeout(() => {
      clearBtn.textContent = 'Clear All';
      clearBtn.disabled = false;
    }, 1500);
  }
}
