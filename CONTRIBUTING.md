# Contributing to Browse With Me

Thank you for your interest in contributing to **Browse With Me**! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)

---

## Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Chrome 138+** installed
2. **Development environment** set up (text editor, git)
3. **Chrome AI flags** enabled (see [INSTALLATION.md](INSTALLATION.md))
4. **Understanding of JavaScript** and Chrome Extension APIs
5. **Familiarity with Chrome AI APIs** (optional but helpful)

### First-Time Contributors

If you're new to the project:

1. Read the [README.md](README.md) to understand what the extension does
2. Follow [INSTALLATION.md](INSTALLATION.md) to install and run the extension
3. Review [USAGE.md](USAGE.md) to understand all features
4. Explore the codebase and get familiar with the structure
5. Look for issues labeled `good first issue` or `help wanted`

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/BrowseWithMe.git
cd BrowseWithMe
```

### 2. Load Extension in Developer Mode

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `BrowseWithMe` folder
5. The extension is now loaded and will auto-reload when you make changes

### 3. Enable Auto-Reload (Optional)

For faster development, you can use the "Reload" button on the extension card at `chrome://extensions/` after making changes. Or use an extension like "Extension Reloader" for automatic reloading.

---

## Project Structure

Understanding the codebase:

```
BrowseWithMe/
├── manifest.json          # Extension configuration (permissions, scripts, etc.)
├── background.js          # Service worker - handles AI API calls and storage
├── content.js             # Content script - extracts page content
├── popup.html             # Extension popup UI structure
├── popup.js               # Popup logic and event handlers
├── popup.css              # Popup styling
├── marked.min.js          # Third-party library for markdown rendering
├── icons/                 # Extension icons (16x16, 48x48, 128x128)
├── README.md              # Project overview
├── INSTALLATION.md        # Installation instructions
├── USAGE.md               # Usage guide
├── TESTING.md             # Testing guide for judges
├── CONTRIBUTING.md        # This file
└── LICENSE                # MIT License
```

### Key Files Explained

**manifest.json**
- Defines extension metadata, permissions, and scripts
- Uses Manifest V3 (latest standard)
- Declares content scripts, background worker, and popup

**background.js (Service Worker)**
- Manages AI API interactions (Summarizer, LanguageModel)
- Handles browsing context storage
- Processes messages from popup and content scripts
- Contains all AI-related logic

**content.js**
- Runs on every webpage
- Extracts visible text content from pages
- Sends content back to background script when requested
- Minimal footprint to avoid impacting page performance

**popup.js**
- Handles user interactions in the extension popup
- Sends messages to background script for AI operations
- Updates UI based on responses
- Manages state and displays results

**popup.html & popup.css**
- UI structure and styling
- Responsive design for consistent appearance
- Includes markdown rendering areas

---

## How to Contribute

### Reporting Bugs

If you find a bug:

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Chrome version, OS, and flag settings
   - Console errors (if any)
   - Screenshots (if applicable)

### Suggesting Enhancements

For new features or improvements:

1. **Open an issue** describing:
   - The problem your enhancement solves
   - Your proposed solution
   - Alternative approaches considered
   - Any potential drawbacks
2. **Wait for feedback** before implementing large changes
3. **Discuss implementation** details with maintainers

### Working on Issues

1. **Comment on the issue** to let others know you're working on it
2. **Ask questions** if anything is unclear
3. **Keep maintainers updated** on progress
4. **Link your pull request** to the issue when ready

---

## Coding Standards

### JavaScript Style

- Use **ES6+ features** (const/let, arrow functions, async/await)
- Use **meaningful variable names** (e.g., `browsingHistory` not `bh`)
- Add **comments** for complex logic
- Keep functions **small and focused** (single responsibility)
- Use **async/await** instead of callbacks or raw promises
- Handle **errors gracefully** with try/catch blocks

### Code Examples

**Good:**
```javascript
async function summarizePage(tabId, type = 'tldr', url, title) {
  try {
    const contentResult = await getPageContent(tabId);
    if (contentResult.error) {
      return { error: contentResult.error };
    }
    return await summarizeContent(contentResult.content, type, url, title);
  } catch (error) {
    console.error('Error summarizing page:', error);
    return { error: error.message };
  }
}
```

**Avoid:**
```javascript
function summarizePage(tabId, type, url, title) {
  getPageContent(tabId, function(contentResult) {
    if (contentResult.error) return { error: contentResult.error };
    summarizeContent(contentResult.content, type, url, title, function(result) {
      return result;
    });
  });
}
```

### Chrome Extension Best Practices

- Use **Manifest V3** patterns (service workers, not persistent background pages)
- Request **minimal permissions** necessary
- Use **chrome.storage.local** for persistence (not localStorage)
- Use **chrome.runtime.sendMessage** for communication between scripts
- Return **true** from message listeners for async responses
- Clean up resources (call `.destroy()` on AI sessions)

### AI API Best Practices

- Always **check availability** before creating sessions
- **Destroy sessions** when done to free resources
- Handle **all three states**: available, downloadable, unavailable
- Provide **user activation** for model downloads (button clicks)
- Show **progress indicators** for long operations
- Include **error handling** for all AI operations

---

## Testing Guidelines

### Manual Testing

Before submitting changes:

1. **Test all affected features** thoroughly
2. **Test error cases** (network errors, missing content, etc.)
3. **Test on different pages** (articles, blogs, SPAs, static sites)
4. **Check console** for errors or warnings
5. **Verify performance** (no significant slowdowns)

### Testing Checklist

- [ ] Extension loads without errors
- [ ] All buttons work correctly
- [ ] Loading states display properly
- [ ] Error messages are helpful
- [ ] AI features work as expected
- [ ] Storage/retrieval works correctly
- [ ] UI updates appropriately
- [ ] No console errors
- [ ] Changes don't break existing features

### Automated Testing

Currently, this project does not have automated tests. **Contributions to add testing infrastructure are welcome!**

Potential testing additions:
- Unit tests for utility functions
- Integration tests for AI API interactions
- E2E tests for user workflows

---

## Submitting Changes

### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if you changed behavior
3. **Follow coding standards** outlined above
4. **Keep commits focused** (one logical change per commit)
5. **Write clear commit messages**

### Commit Message Format

Use descriptive commit messages:

```
[Component] Brief description of change

More detailed explanation if needed. Describe what changed and why.

Fixes #issue-number (if applicable)
```

**Examples:**
```
[Popup] Add loading spinner for summarization

Added a visual loading indicator to improve UX when waiting for
AI-generated summaries. The spinner appears in the summary container
during processing.

Fixes #42
```

```
[Background] Improve error handling for AI API calls

Added more specific error messages and graceful degradation when
AI APIs are unavailable. Also added retry logic for transient failures.
```

### Pull Request Process

1. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m "[Component] Description of changes"
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a pull request** on GitHub with:
   - Clear title describing the change
   - Description of what changed and why
   - Link to related issues
   - Screenshots (if UI changes)
   - Testing steps for reviewers

5. **Respond to feedback** from reviewers
6. **Make requested changes** if needed
7. **Wait for approval** and merge

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Enhancement
- [ ] Documentation update
- [ ] Refactoring

## Related Issue
Fixes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How these changes were tested:
1. Step 1
2. Step 2

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tested all affected features
```

---

## Areas for Contribution

### High Priority

- **Error handling improvements** - More graceful handling of edge cases
- **Performance optimization** - Reduce memory usage, faster processing
- **UI/UX enhancements** - Better visual design, accessibility
- **Testing infrastructure** - Unit tests, integration tests, E2E tests
- **Documentation** - More examples, video tutorials, FAQs

### Feature Ideas

- **Custom summary lengths** - User-configurable summary size
- **Export functionality** - Save summaries as markdown/PDF
- **Keyboard shortcuts** - Quick access to features
- **Theme support** - Dark mode, custom colors
- **Multi-language support** - Internationalization
- **Better context visualization** - Graph view of browsing history
- **Page comparison** - Side-by-side comparison of multiple pages
- **Tags and categories** - Organize saved pages
- **Search in history** - Find pages by content

### Code Quality

- **Refactoring** - Improve code organization and readability
- **Type safety** - Add JSDoc comments or migrate to TypeScript
- **Code documentation** - Better inline comments
- **Consistent formatting** - Add linting/formatting tools
- **Security review** - Audit for potential vulnerabilities

---

## Development Tips

### Debugging

**Background Script:**
- Right-click extension icon → "Inspect service worker"
- View console logs and network requests
- Set breakpoints in background.js

**Popup:**
- Right-click popup → "Inspect"
- View console logs and DOM
- Set breakpoints in popup.js

**Content Script:**
- Open DevTools on target page (F12)
- Console shows content script logs
- Set breakpoints in content.js

### Common Pitfalls

1. **Service worker goes inactive** - It sleeps after inactivity, store persistent state in chrome.storage
2. **Message passing** - Remember to return `true` from listeners for async responses
3. **Content script injection** - Some pages block scripts, handle gracefully
4. **AI session cleanup** - Always call `.destroy()` to avoid memory leaks
5. **User activation required** - Model downloads need user gesture (button click)

---

## Getting Help

If you need help:

1. **Check documentation** - README, INSTALLATION, USAGE guides
2. **Review existing issues** - Someone may have asked the same question
3. **Ask in issues** - Open a new issue with the "question" label
4. **Chrome AI documentation** - https://developer.chrome.com/docs/ai/

---

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Git commit history

Thank you for contributing to **Browse With Me**! Your efforts help make browsing more intelligent and enjoyable for everyone.
