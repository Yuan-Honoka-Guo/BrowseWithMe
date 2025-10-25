# Browse With Me

> An AI-powered browsing copilot that understands your context and provides intelligent insights

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome](https://img.shields.io/badge/Chrome-138+-blue.svg)](https://www.google.com/chrome/)

## Overview

**Browse With Me** is a Chrome extension that leverages Google's cutting-edge **Gemini Nano** AI APIs to transform your browsing experience. It acts as an intelligent copilot that:

- **Analyzes web pages** with contextual understanding of your current task
- **Summarizes articles** in multiple formats (TL;DR, key points, headlines, teasers)
- **Remembers your browsing context** across pages to provide better insights
- **Provides AI-powered suggestions** that are sometimes helpful, sometimes humorous
- **Runs completely locally** - all AI processing happens on your device using Chrome's built-in AI

This extension was built for the **Google Chrome Built-in AI Challenge 2025**, showcasing the capabilities of on-device AI with Chrome's Gemini Nano model.

## Key Features

### Intelligent Page Analysis
The copilot analyzes the current page content and provides contextual insights based on your task and browsing history. It connects information across pages to help you find what you're looking for.

### Flexible Summarization
Choose from multiple summary types:
- **TL;DR** - Quick overview
- **Key Points** - Bullet-point summary
- **Teaser** - Decide if you want to read more
- **Headline** - One-line summary

### Browsing Context Memory
The extension remembers the last 10 pages you've analyzed, building context to provide more relevant suggestions as you browse.

### Task-Aware Assistance
Tell the copilot what you're trying to accomplish, and it will tailor its insights to your specific needs.

### Privacy-First Design
All AI processing happens locally on your device. No data is sent to external servers, and your browsing history stays private.

## Technology Stack

- **Chrome Extension Manifest V3** - Modern extension architecture
- **Gemini Nano AI** - Google's on-device AI model
- **Chrome AI APIs**:
  - [Summarizer API](https://developer.chrome.com/docs/ai/summarizer-api) - For page summarization
  - [Prompt API](https://developer.chrome.com/docs/ai/prompt-api) - For contextual suggestions
- **Marked.js** - Markdown rendering for formatted output
- **Chrome Storage API** - Local context persistence

## Getting Started

### Prerequisites

- **Chrome 138+** (Required for built-in AI APIs)
- **22 GB free disk space** (for AI model download)
- **16 GB RAM** recommended
- **Enable Chrome AI flags** - See [INSTALLATION.md](INSTALLATION.md) for details

### Installation

For detailed installation instructions, see **[INSTALLATION.md](INSTALLATION.md)**.

**Quick Start:**

1. Enable required Chrome flags at `chrome://flags`:
   - `#Prompt API for Gemini Nano with Multimodal Input`
   - `#Summarization API for Gemini Nano`

2. Clone this repository:
   ```bash
   git clone <repository-url>
   cd BrowseWithMe
   ```

3. Load the extension:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `BrowseWithMe` folder

4. Download AI models (first-time setup):
   - Click the extension icon
   - Click "Download AI Model" button
   - Wait for model download

### Usage

For detailed usage instructions, see **[USAGE.md](USAGE.md)**.

**Quick Usage:**

1. **Set your task**: Enter what you're trying to accomplish
2. **Analyze pages**: Get AI-powered insights about the current page
3. **Summarize content**: Choose a summary type and get instant summaries
4. **Review context**: Check your browsing history to see what you've learned

## Testing the Extension

For judges and testers, see **[TESTING.md](TESTING.md)** for:
- Step-by-step testing workflows
- Example scenarios to try
- Expected behavior for each feature
- Troubleshooting common issues

## Project Structure

```
BrowseWithMe/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (AI API logic)
├── popup.html/js/css      # Extension popup UI
├── content.js             # Page content extraction
├── marked.min.js          # Markdown rendering library
├── icons/                 # Extension icons
├── README.md              # This file
├── INSTALLATION.md        # Detailed installation guide
├── USAGE.md               # Detailed usage guide
├── TESTING.md             # Testing guide for judges
├── CONTRIBUTING.md        # Contributing guidelines
└── LICENSE                # MIT License
```

## How It Works

### Architecture

1. **Content Script** ([content.js](content.js)) - Extracts visible text from web pages
2. **Service Worker** ([background.js](background.js)) - Manages AI API calls and context storage
3. **Popup Interface** ([popup.js](popup.js), [popup.html](popup.html)) - User interaction and display

### API Usage

**Official Chrome AI APIs:**
- `Summarizer.create()` - Creates summarization sessions
- `LanguageModel.create()` - Creates prompt-based AI sessions
- `session.prompt()` - Generates contextual suggestions

**Custom Functions (We Wrote):**
- `getPageContent()` - Extracts and preprocesses page content
- `storeBrowsingContext()` - Manages browsing history
- `generateSuggestion()` - Creates task-aware suggestions
- `renderMarkdown()` - Formats AI output

For complete API documentation, see:
- [Chrome Summarizer API](https://developer.chrome.com/docs/ai/summarizer-api)
- [Chrome Prompt API](https://developer.chrome.com/docs/ai/prompt-api)
- [Chrome AI Overview](https://developer.chrome.com/docs/ai/)

## Limitations

- **Chrome 138+ only** - Built-in AI APIs are not available in older versions
- **Desktop only** - Not available on mobile Chrome
- **22 GB storage** - Required for AI model download
- **Limited to 10 pages** - Browsing history stores only the last 10 analyzed pages
- **Content extraction** - May not work well on heavily dynamic single-page applications

See [USAGE.md](USAGE.md) for detailed limitations.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the **Google Chrome Built-in AI Challenge**
- Powered by **Gemini Nano** and Chrome's built-in AI APIs
- Markdown rendering by **Marked.js**

## Support

If you encounter issues:
1. Check [INSTALLATION.md](INSTALLATION.md) for troubleshooting
2. Review [TESTING.md](TESTING.md) for common issues
3. Ensure you meet all prerequisites
4. Verify Chrome flags are enabled and browser is restarted

---

**Enjoy browsing with your AI copilot!**
