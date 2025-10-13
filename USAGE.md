# Browse With Me - Usage Guide

## Overview

Browse With Me is an AI-powered browsing copilot that helps you understand web content, provides contextual suggestions, and remembers your browsing context across pages.

## Main Features

### 1. Set Current Task

Tell the copilot what you're trying to accomplish so it can provide more relevant insights.

**How to use:**
1. Click the extension icon
2. Enter your current task in the "Current Task" field
   - Example: "Researching React performance optimization"
   - Example: "Looking for recipes with chicken and mushrooms"
   - Example: "Learning about Chrome extension development"
3. Click "Update Task"

The copilot will use this context when analyzing pages and generating suggestions.

### 2. Analyze Page

Get AI-powered insights and suggestions about the current page.

**How to use:**
1. Navigate to any webpage
2. Click the extension icon
3. Click "Analyze Page" button
4. Wait for the AI to generate insights

**What you'll get:**
- Helpful suggestions related to your task
- Contextual insights about the page content
- Humorous observations (sometimes!)
- Connections to your browsing history

**Best for:**
- Understanding complex articles
- Getting quick opinions on content
- Discovering connections to your task
- Finding key takeaways

### 3. Summarize Page

Generate different types of summaries for the current page.

**How to use:**
1. Navigate to any webpage with article content
2. Click the extension icon
3. Select summary type from dropdown:
   - **TL;DR**: Quick overview (default)
   - **Key Points**: Bullet-point summary of main ideas
   - **Teaser**: Brief preview to decide if you want to read more
   - **Headline**: Short one-line summary
4. Click "Summarize" button

**What you'll get:**
- Formatted markdown summary
- Summary type optimized for your needs
- Saved to browsing history for later reference

**Best for:**
- Long articles or blog posts
- Research papers or documentation
- News articles
- Tutorial content

### 4. Browsing Context History

The extension automatically remembers pages you've analyzed and summarized.

**How to use:**
1. Click the extension icon
2. Scroll to "Browsing Context" section
3. View your recent browsing history with summaries
4. Click "Refresh History" to update

**What you'll see:**
- Page titles and URLs
- Summaries of analyzed pages
- Timestamps (how long ago you visited)
- Last 10 pages visited

**Benefits:**
- Remember what you learned from previous pages
- Connect information across browsing sessions
- The AI uses this context to provide better suggestions
- Quickly review what you've already read

## Tips for Best Results

### Getting Quality Summaries

1. **Use on content-rich pages**
   - Articles, blog posts, documentation work best
   - Landing pages and navigation pages may not summarize well

2. **Choose the right summary type**
   - Use "TL;DR" for general quick summaries
   - Use "Key Points" when you need specific information
   - Use "Teaser" to decide if you should read the full article
   - Use "Headline" for the quickest possible overview

3. **Provide context with tasks**
   - Setting your current task helps the AI focus on relevant information
   - Update your task as you switch between different research topics

### Making the Most of Analysis

1. **Be specific with your task**
   - "Learning JavaScript" → "Understanding JavaScript async/await patterns"
   - "Looking for recipes" → "Finding healthy chicken recipes under 30 minutes"

2. **Use on relevant pages**
   - The copilot provides better insights when the page relates to your task
   - Try analyzing multiple pages on the same topic to build context

3. **Review browsing history**
   - The copilot learns from your browsing patterns
   - It can make connections between pages you've visited

## Content Script Features

The extension also adds a floating copilot button to every webpage:

- **Location**: Bottom-right corner of pages
- **Purpose**: Quick visual reminder that the copilot is available
- **Action**: Click to toggle a mini-panel (currently shows reminder to use main popup)

## Privacy & Data

**What's stored:**
- Your current task (stored locally)
- Last 10 pages with summaries (stored locally)
- No data is sent to external servers

**What's NOT stored:**
- Your browsing history beyond the last 10 analyzed pages
- Any personal information
- Passwords or form data

**AI Processing:**
- All AI processing happens locally in your browser using Gemini Nano
- No content is sent to cloud services
- Page content is only processed when you click "Analyze" or "Summarize"

## Limitations

### Technical Limitations

1. **Model Availability**
   - Requires Chrome 138+ with AI flags enabled
   - Requires ~22 GB for AI model download
   - Not available on mobile devices

2. **Page Compatibility**
   - Works best on static content pages
   - May not work well on:
     - Single-page applications with dynamic content
     - Pages with heavy JavaScript rendering
     - chrome:// internal pages
     - Some sites with strict content security policies

3. **Content Length**
   - Summarization works best on pages with 500-5000 words
   - Very short pages may not provide meaningful summaries
   - Very long pages are truncated to first ~5000 characters

### Feature Limitations

1. **History Size**
   - Only stores last 10 pages
   - Older entries are automatically removed

2. **AI Model**
   - Gemini Nano is optimized for on-device use
   - May not be as powerful as cloud-based AI models
   - Response quality depends on content quality

## Keyboard Shortcuts

Currently, there are no keyboard shortcuts configured. You can add custom shortcuts via:
1. Go to `chrome://extensions/shortcuts`
2. Find "Browse With Me"
3. Set your preferred shortcuts

Suggested shortcuts:
- Open extension popup: `Ctrl+Shift+B` (or `Cmd+Shift+B` on Mac)

## Example Workflows

### Research Workflow

1. Set task: "Researching best practices for React performance"
2. Visit first article → Click "Summarize" with "Key Points"
3. Visit second article → Click "Analyze Page" to see how it relates
4. Visit third article → Check "Browsing Context" to review what you've learned
5. Continue building context as you research

### Content Review Workflow

1. Set task: "Reviewing articles for newsletter"
2. Visit article → Click "Summarize" with "Teaser"
3. Review summary to decide if it's interesting
4. If interesting, click "Analyze Page" for deeper insights
5. Check browsing history to compare articles

### Learning Workflow

1. Set task: "Learning about Chrome AI APIs"
2. Visit documentation → Click "Summarize" with "Key Points"
3. Visit tutorial → Click "Analyze Page" for suggestions
4. Visit example code → The copilot connects it to previous pages
5. Build comprehensive understanding across multiple sources

## Troubleshooting

### No Summary Generated

**Problem**: Clicking "Summarize" shows an error

**Solutions**:
- Ensure the page has enough readable content
- Try refreshing the page
- Check AI status indicator shows "AI Ready"
- Try a different summary type

### Analysis Not Relevant

**Problem**: "Analyze Page" gives generic suggestions

**Solutions**:
- Set a more specific current task
- Make sure you're on a content-related page
- Build more browsing context by analyzing related pages

### Slow Performance

**Problem**: Summarization or analysis is slow

**Solutions**:
- This is normal for first use after browser restart (model loading)
- Subsequent requests should be faster
- Very long pages take longer to process
- Ensure your system meets the recommended requirements

## Feedback & Support

If you encounter issues or have suggestions:
1. Check the browser console for error messages
2. Verify your Chrome version and AI flag settings
3. Review the [INSTALLATION.md](INSTALLATION.md) troubleshooting section
4. Report issues with specific examples of what's not working

Enjoy browsing with your AI copilot!
