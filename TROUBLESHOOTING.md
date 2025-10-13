# Troubleshooting Guide - Browse With Me Extension

## Common Issue: `self.ai is undefined`

### Problem
When you open the extension popup or try to use AI features, you see errors about `self.ai` being undefined or the status shows "AI APIs not available".

### Root Causes

The Chrome AI APIs (`self.ai`) will be undefined if:

1. **Chrome Flags Not Enabled** - Most common cause
2. **Chrome Version Too Old** - Need Chrome 138+
3. **Platform Not Supported** - Mobile devices not supported
4. **API Not Yet Rolled Out** - APIs are still experimental

### Solution Steps

#### Step 1: Verify Chrome Version

1. Go to `chrome://version`
2. Check that you're running **Chrome 138 or later**
3. If older, update Chrome:
   - Menu → Help → About Google Chrome
   - Let it update and restart

#### Step 2: Enable Required Chrome Flags

This is the **most important step**. You MUST enable these flags:

1. Navigate to `chrome://flags`

2. Search for and **enable** the following flags:

   **For AI Model:**
   - `#optimization-guide-on-device-model` → **Enabled**

   **For Summarizer API:**
   - `#summarization-api-for-gemini-nano` → **Enabled**

   **For Writer API:**
   - `#writer-api-for-gemini-nano` → **Enabled**

   **For Prompt API (optional):**
   - `#prompt-api-for-gemini-nano` → **Enabled**
   - `#prompt-api-for-gemini-nano-multimodal-input` → **Enabled**

3. **Restart Chrome** (not just reload - full browser restart)

4. After restart, reload the extension:
   - Go to `chrome://extensions`
   - Click the reload icon on "Browse With Me"

#### Step 3: Verify API Availability

After enabling flags and restarting:

1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Type: `console.log(self.ai)`
4. Press Enter

**Expected Result:**
- You should see an object with properties like `summarizer`, `writer`, etc.
- If you see `undefined`, the flags didn't take effect - restart Chrome again

**Alternative Check:**
```javascript
// Check Summarizer availability
const availability = await self.ai.summarizer.capabilities();
console.log('Summarizer available:', availability.available);
```

Possible values:
- `'readily'` - ✅ Model ready to use
- `'after-download'` - ⚠️ Model needs download (use the button in extension)
- `'no'` - ❌ Not supported on device

#### Step 4: Check System Requirements

If APIs are still undefined after enabling flags:

**Minimum Requirements:**
- **OS**: Windows 10/11, macOS 13+, Linux, or ChromeOS
- **RAM**: 16 GB (4 GB minimum but degraded performance)
- **CPU**: 4+ cores recommended
- **GPU**: 4+ GB VRAM recommended
- **Storage**: 22 GB free space for AI model
- **Network**: Unmetered connection for model download

**Not Supported:**
- ❌ Mobile devices (Android/iOS)
- ❌ Chrome on older operating systems
- ❌ Devices with insufficient RAM/storage

#### Step 5: Check Extension Background Service Worker

1. Go to `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Find "Browse With Me"
4. Click "Inspect views: service worker"
5. Check the Console for errors

**Common errors and solutions:**

**Error:** `self.ai is undefined`
- **Solution**: Enable the flags and restart Chrome (Step 2)

**Error:** `ReferenceError: ai is not defined`
- **Solution**: Flags not enabled or Chrome version too old

**Error:** `capabilities() failed`
- **Solution**: Your device may not meet system requirements

### Testing After Fixes

1. **Open extension popup**
   - Status should show green "AI Ready" OR
   - Yellow "AI Model needs to be downloaded" with download button

2. **If download button appears:**
   - Click "Download AI Model"
   - Wait for ~22 GB download (takes several minutes)
   - Status will change to "AI Ready" when complete

3. **Test a feature:**
   - Navigate to any article page
   - Click extension icon
   - Click "Summarize" button
   - Should see a summary appear (not an error)

## Other Common Issues

### Issue: Extension popup shows blank/white screen

**Cause**: JavaScript error in popup script

**Solution**:
1. Right-click extension icon → "Inspect popup"
2. Check Console for errors
3. Most likely cause: `self.ai is undefined` - see above

### Issue: "Analyze Page" or "Summarize" buttons don't work

**Possible Causes:**

1. **AI model not downloaded**
   - **Solution**: Click "Download AI Model" button first

2. **Page content can't be extracted**
   - **Solution**: Try on a different page (not chrome:// pages)
   - Works best on: articles, blogs, documentation
   - Doesn't work on: chrome:// pages, some SPAs

3. **Content script not injected**
   - **Solution**: Refresh the page, then try again

### Issue: Download button appears but clicking does nothing

**Cause**: User activation failed or network issue

**Solutions**:
1. Make sure you have 22+ GB free storage
2. Check you're on an unmetered network
3. Try closing and reopening the popup, then click again
4. Check background service worker console for errors

### Issue: Features work but responses are slow

**Cause**: Normal for on-device AI

**Expected Performance:**
- First request after browser start: 10-30 seconds (model loading)
- Subsequent requests: 2-10 seconds
- Very long pages: May take longer

**Tips:**
- Don't reload Chrome frequently (model stays loaded)
- Summarize shorter content when possible
- Close other Chrome tabs to free up RAM

## Debug Commands

Open the background service worker console and try these:

```javascript
// Check if AI is available
console.log('self.ai:', self.ai);

// Check specific API
console.log('Summarizer:', self.ai?.summarizer);

// Check capabilities
const caps = await self.ai.summarizer.capabilities();
console.log('Summarizer availability:', caps.available);

// Test creating a session
const summarizer = await self.ai.summarizer.create();
console.log('Session created:', summarizer);
summarizer.destroy();
```

## Still Not Working?

If you've tried all the above and `self.ai` is still undefined:

1. **Verify your Chrome build**
   - Some enterprise or custom Chrome builds may have APIs disabled
   - Try on a fresh Chrome installation

2. **Check Chrome release channel**
   - Dev/Canary channels may have more APIs available
   - Consider trying Chrome Canary for bleeding-edge features

3. **Wait for API rollout**
   - The APIs are experimental and rolling out gradually
   - Check [Chrome Platform Status](https://chromestatus.com) for availability

4. **Check Chrome documentation**
   - Visit [Chrome AI Documentation](https://developer.chrome.com/docs/ai)
   - APIs may have changed or flag names may have been updated

## Additional Resources

- [Chrome AI Documentation](https://developer.chrome.com/docs/ai)
- [Chrome Flags](chrome://flags)
- [Chrome Version](chrome://version)
- [Extensions Page](chrome://extensions)

## Reporting Issues

If you find a bug in the extension itself (not Chrome AI availability):

1. Open background service worker console
2. Open popup inspector console
3. Copy any error messages
4. Note your Chrome version and OS
5. Describe what you were trying to do
6. Report with all the above information
