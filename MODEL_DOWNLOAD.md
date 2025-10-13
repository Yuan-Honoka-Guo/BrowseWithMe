# AI Model Download Implementation

## Overview

This document explains how the AI model download feature works in the Browse With Me extension, based on Chrome's user activation requirements for AI APIs.

## User Activation Requirement

According to [Chrome's AI documentation](https://developer.chrome.com/docs/ai/get-started#user-activation), downloading AI models requires **user activation**. This means:

- A user interaction (click, tap, or key press) is required to start a session with `create()` if the model is not yet available
- You cannot automatically download models in the background without user interaction
- This is a security/privacy feature to ensure users are aware of large downloads

## Implementation

### 1. Model Availability States

The extension checks for three availability states:

```javascript
const capabilities = await self.ai.summarizer.capabilities();
// capabilities.available can be:
// - 'readily': Model is downloaded and ready
// - 'after-download': Model needs to be downloaded
// - 'no': API not supported on this device
```

### 2. Background Service Worker ([background.js](background.js))

**Function: `checkAICapabilities()`**
- Returns the actual availability state (not just boolean)
- Used by the popup to determine UI state

**Function: `downloadAIModel(apiType)`**
- Checks the model availability status
- If status is 'after-download', calls `create()` to trigger download
- The `create()` call must happen with user activation present
- Returns success/error messages to the UI

### 3. Popup UI ([popup.html](popup.html), [popup.css](popup.css), [popup.js](popup.js))

**Status Indicator**
- Shows three states with visual feedback:
  - Green dot: "AI Ready"
  - Yellow dot: "AI Model needs to be downloaded"
  - Red dot: "AI APIs not available"

**Download Button**
- Only shown when model status is 'after-download'
- Clicking the button provides the required user activation
- Button is styled with orange color to draw attention
- Shows loading state during download

**Download Status Messages**
- Appears below the download button
- Shows progress and outcome
- Color-coded (blue for in-progress, green for success, red for error)

### 4. User Flow

```
1. User installs extension
   ↓
2. User opens extension popup
   ↓
3. Extension checks AI capabilities
   ↓
4a. If 'readily' available:
    → Show "AI Ready" (green)
    → User can use features immediately

4b. If 'after-download':
    → Show "AI Model needs to be downloaded" (yellow)
    → Show "Download AI Model" button
    ↓
5. User clicks "Download AI Model" button
   ↓
6. Button click = user activation
   ↓
7. Extension calls ai.summarizer.create()
   ↓
8. Chrome starts downloading Gemini Nano model
   ↓
9. Status message shows "Model download started..."
   ↓
10. Status refreshes to "AI Ready" when complete
```

## Code Examples

### Checking Capabilities with States

```javascript
async function checkAICapabilities() {
  const capabilities = {
    summarizer: 'unknown',
    writer: 'unknown'
  };

  if ('ai' in self && 'summarizer' in self.ai) {
    const canSummarize = await self.ai.summarizer.capabilities();
    capabilities.summarizer = canSummarize.available;
  }

  return capabilities;
}
```

### Triggering Download with User Activation

```javascript
async function downloadAIModel(apiType = 'summarizer') {
  const capabilities = await self.ai.summarizer.capabilities();

  if (capabilities.available === 'after-download') {
    // Creating a session triggers the download
    // This MUST be called with user activation present
    const summarizer = await self.ai.summarizer.create();
    summarizer.destroy(); // Clean up immediately

    return { success: true, message: 'Model download started' };
  }
}
```

### Popup UI Logic

```javascript
async function checkAIStatus() {
  const response = await chrome.runtime.sendMessage({ action: 'checkCapabilities' });

  const needsDownload =
    response.summarizer === 'after-download' ||
    response.writer === 'after-download';

  if (needsDownload) {
    statusText.textContent = 'AI Model needs to be downloaded';
    downloadBtn.style.display = 'block'; // Show download button
  }
}

async function downloadModel() {
  // This function is called from a button click = user activation
  const result = await chrome.runtime.sendMessage({
    action: 'downloadModel',
    apiType: 'summarizer'
  });

  if (result.success) {
    // Show success message and refresh status
    await checkAIStatus();
  }
}
```

## Key Takeaways

1. **User activation is mandatory** - You cannot download models without user interaction
2. **Check capabilities first** - Always check `capabilities().available` before attempting to create a session
3. **Provide clear UI feedback** - Users need to know when download is needed and when it's in progress
4. **Handle all states** - 'readily', 'after-download', and 'no' should all have appropriate UI states
5. **The button click is the trigger** - Calling `create()` from a click event handler satisfies the user activation requirement

## Testing

To test the download flow:

1. Clear Chrome's AI model cache (if you want to test from scratch)
2. Ensure Chrome flags are enabled
3. Open extension popup
4. Verify you see the yellow status and download button
5. Click the download button
6. Monitor the status messages
7. Check that status changes to green when complete

## References

- [Chrome AI Get Started - User Activation](https://developer.chrome.com/docs/ai/get-started#user-activation)
- [Chrome AI Summarizer API](https://developer.chrome.com/docs/ai/summarizer-api)
- [Chrome AI Built-in APIs](https://developer.chrome.com/docs/ai)
