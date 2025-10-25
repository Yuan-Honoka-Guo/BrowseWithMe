# Browse With Me - Installation Guide

## Prerequisites

Before installing this extension, ensure you have:

1. **Chrome Browser** (Version 138 or later)
   - The AI APIs are only available in Chrome 138+

2. **Enable Chrome AI APIs** (Required for AI features)
   - Navigate to `chrome://flags`
   - Search for and enable the following flags:
     - `#Prompt API for Gemini Nano with Multimodal Input`
     - `#Summarization API for Gemini Nano`
   - Restart Chrome

3. **System Requirements**
   - **Operating System**: Windows 10/11, macOS 13+, Linux, or ChromeOS
   - **Storage**: 22 GB free space (for AI model download)
   - **RAM**: 16 GB recommended
   - **CPU**: 4+ cores recommended
   - **GPU**: 4+ GB VRAM recommended

## Installation Steps

### Method 1: Load Unpacked Extension (Development)

1. **Download or Clone the Extension**
   ```bash
   git clone <repository-url>
   cd BrowseWithMe
   ```

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or click Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `BrowseWithMe` folder
   - The extension should now appear in your extensions list

5. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Browse With Me"
   - Click the pin icon to keep it visible

### Method 2: Install from Chrome Web Store (Future)

Once published, you'll be able to install directly from the Chrome Web Store.

## Initial Setup

### 1. Download AI Models

On first use, Chrome will need to download the Gemini Nano AI model:

1. Click the "Browse With Me" extension icon
2. The status indicator will show the AI availability status:
   - **"AI Ready"** (green dot) - Models are downloaded and ready to use
   - **"AI Model needs to be downloaded"** (yellow dot) - Click the "Download AI Model" button that appears
   - **"AI APIs not available on this device"** (red dot) - Your device doesn't meet requirements
3. If models need to be downloaded:
   - Click the **"Download AI Model"** button (this provides the required user activation)
   - The button click triggers the model download
   - Download may take several minutes depending on connection speed
   - Ensure you're on an unmetered network connection
   - A status message will appear showing download progress
   - The status will update to "AI Ready" once complete

### 2. Grant Permissions

The extension will request permissions to:
- Read and modify webpage content (to extract page information)
- Store data locally (to remember browsing context)
- Access active tabs (to analyze current page)

These permissions are necessary for the copilot features to work.

## Verification

To verify the installation:

1. **Check Extension Status**
   - Click the extension icon
   - You should see "AI Ready" status

2. **Test on a Webpage**
   - Navigate to any article or webpage
   - Click the extension icon
   - Try the "Analyze Page" or "Summarize" features

3. **Check Console for Errors**
   - Right-click extension icon → "Inspect popup"
   - Check the console for any errors

### Model Download Fails

**Issue**: AI model download fails or times out

**Solutions**:
1. Ensure you have 22+ GB free storage
2. Use an unmetered network connection
3. Check your internet connection is stable
4. Try restarting Chrome and downloading again

### Features Not Working

**Issue**: Summarization or suggestions don't work

**Solutions**:
1. Verify page content can be extracted (check content script)
2. Ensure you're on a page with readable content (not chrome:// pages)
3. Check background service worker console for errors
4. Try refreshing the page and extension

## Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify all installation steps were completed
3. Review the system requirements
4. Check Chrome version and flag settings

## Next Steps

Once installed, see [USAGE.md](USAGE.md) for instructions on how to use the extension's features.
