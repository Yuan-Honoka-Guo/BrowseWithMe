# Browse With Me - Testing Guide for Judges

This guide provides step-by-step instructions for judges and testers to evaluate the **Browse With Me** Chrome extension.

## Table of Contents

- [Quick Prerequisites Check](#quick-prerequisites-check)
- [Installation for Testing](#installation-for-testing)
- [Testing Scenarios](#testing-scenarios)
- [Feature-by-Feature Testing](#feature-by-feature-testing)
- [Expected Results](#expected-results)
- [Common Issues & Solutions](#common-issues--solutions)
- [Evaluation Checklist](#evaluation-checklist)

---

## Quick Prerequisites Check

Before testing, ensure your system meets these requirements:

### System Requirements
- [ ] **Chrome Version 138 or later** - Check at `chrome://settings/help`
- [ ] **22+ GB free disk space** - For AI model download
- [ ] **16+ GB RAM** - Recommended for optimal performance
- [ ] **Windows 10/11, macOS 13+, Linux, or ChromeOS**

### Chrome Flags Configuration

1. Navigate to `chrome://flags`
2. Search for and **enable** these flags:
   - `#Prompt API for Gemini Nano with Multimodal Input` → **Enabled**
   - `#Summarization API for Gemini Nano` → **Enabled**
3. Click **"Relaunch"** to restart Chrome

**IMPORTANT:** Chrome must be fully restarted after enabling flags. Close all Chrome windows and reopen.

---

## Installation for Testing

### Step 1: Load the Extension

1. Download or extract the extension files to a folder
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the `BrowseWithMe` folder
6. The extension should appear in your extensions list

### Step 2: Pin the Extension

1. Click the puzzle piece icon in Chrome toolbar
2. Find **"Browse With Me"**
3. Click the pin icon to keep it visible in toolbar

### Step 3: Download AI Models

1. Click the **"Browse With Me"** extension icon
2. Check the status indicator:
   - **Green dot + "AI Ready"** = Models already downloaded, skip to testing
   - **Yellow dot + "AI Model needs to be downloaded"** = Continue below
   - **Red dot + "AI APIs not available"** = Check prerequisites above

3. If download is needed:
   - Click **"Download AI Model"** button
   - Wait for ~22 GB download (may take 10-30 minutes)
   - Progress bar will show download status
   - Status will change to "AI Ready" when complete

**Note:** First-time model download requires a good internet connection and patience. Ensure you're on an unmetered network.

---

## Testing Scenarios

Here are three complete testing workflows to evaluate the extension's capabilities.

### Scenario 1: Research Workflow (Recommended First Test)

**Goal:** Demonstrate context-aware browsing and summarization

**Steps:**

1. **Set a research task:**
   - Click the extension icon
   - In "Current Task" field, enter: `"Researching Chrome AI APIs"`
   - Click **"Update Task"**
   - The extension should analyze the current page automatically

2. **Summarize a technical article:**
   - Navigate to: https://developer.chrome.com/docs/ai/built-in
   - Click the extension icon
   - Select **"Key Points"** from summary type dropdown
   - Click **"Summarize"**
   - Wait 5-10 seconds for summary

3. **Analyze a related page:**
   - Navigate to: https://developer.chrome.com/docs/ai/summarizer-api
   - Click the extension icon
   - Click **"Analyze Page"**
   - The AI should provide suggestions related to your task

4. **Review browsing context:**
   - Scroll down in the extension popup
   - Check **"Browsing Context"** section
   - You should see both pages with their summaries

**Expected Results:**
- Summary captures key information about Chrome AI APIs
- Analysis connects the second page to your research task
- Browsing history shows both pages with timestamps
- Context is maintained across pages

---

### Scenario 2: Content Discovery Workflow

**Goal:** Test different summary types and task-specific suggestions

**Steps:**

1. **Set a new task:**
   - Click extension icon
   - Change task to: `"Finding interesting tech news"`
   - Click **"Update Task"**

2. **Test TL;DR summary:**
   - Visit any tech news article (e.g., TechCrunch, The Verge)
   - Click extension icon
   - Select **"TL;DR"** summary type
   - Click **"Summarize"**

3. **Test Teaser summary:**
   - Visit another article
   - Select **"Teaser"** summary type
   - Click **"Summarize"**
   - Compare with TL;DR - teasers should be shorter

4. **Test Headline summary:**
   - Visit a third article
   - Select **"Headline"** summary type
   - Click **"Summarize"**
   - Should produce a one-line summary

**Expected Results:**
- Different summary types produce appropriately formatted outputs
- TL;DR is comprehensive, Teaser is brief, Headline is single-line
- Each summary is saved to browsing history

---

### Scenario 3: Context Memory Test

**Goal:** Verify the extension remembers and uses browsing context

**Steps:**

1. **Set a specific task:**
   - Enter task: `"Learning about JavaScript async patterns"`
   - Click **"Update Task"**

2. **Build context with multiple pages:**
   - Visit 3-4 pages about JavaScript async/await
   - For each page, click **"Analyze Page"**
   - Note how suggestions evolve with more context

3. **Check context retention:**
   - Click **"Refresh History"** button
   - Verify all analyzed pages appear in history
   - Should see up to 10 most recent pages

4. **Test clear history:**
   - Click **"Clear All"** button
   - Confirm the action
   - History should be empty
   - Previous summaries should be cleared

**Expected Results:**
- Extension remembers last 10 pages
- Later analyses reference earlier pages
- Clear All successfully removes all history

---

## Feature-by-Feature Testing

### Feature: AI Status Indicator

**Location:** Top of extension popup

**Test:**
1. Open extension popup
2. Check status indicator

**Expected:**
- Green dot + "AI Ready" = Working correctly
- Any other status = Check troubleshooting section

---

### Feature: Current Task

**Location:** First section of popup

**Test:**
1. Enter a task description
2. Click "Update Task"
3. Click "Analyze Page"

**Expected:**
- Button shows "Updating..." briefly
- Changes to "Task Updated!"
- Page is automatically analyzed with new task context
- Suggestions relate to the task

---

### Feature: Page Analysis

**Location:** "Analyze Page" button

**Test:**
1. Visit any content-rich webpage
2. Click "Analyze Page"

**Expected:**
- Button shows "Analyzing..." during processing
- Takes 3-10 seconds
- Returns AI-generated suggestions in markdown format
- Suggestions are contextual and related to current task
- May include helpful or humorous observations

**Note:** Analysis quality depends on page content. Works best on articles, blogs, and documentation.

---

### Feature: Page Summarization

**Location:** Summary section with dropdown

**Test each summary type:**

**TL;DR:**
- Comprehensive overview
- Multiple sentences
- Covers main points

**Key Points:**
- Bullet-point format
- Highlights important information
- Easier to scan

**Teaser:**
- Brief preview
- Helps decide if worth reading
- 1-2 sentences

**Headline:**
- Single-line summary
- Captures essence quickly
- Very concise

**Expected:**
- Each type produces appropriately formatted output
- Summaries are rendered as formatted markdown (bullets, bold, etc.)
- Summary is saved to browsing context
- History updates automatically

---

### Feature: Browsing Context History

**Location:** Bottom section of popup

**Test:**
1. Analyze/summarize several pages
2. Click "Refresh History"

**Expected:**
- Shows last 10 pages
- Displays page title, URL, and timestamp
- Shows summary preview (first 100 characters)
- Newest pages appear first
- Timestamps show relative time ("5 minutes ago", "2 hours ago", etc.)

---

### Feature: Clear All History

**Location:** "Clear All" button in history section

**Test:**
1. Build up some history
2. Click "Clear All"
3. Confirm dialog

**Expected:**
- Confirmation dialog appears
- After confirming, all history is cleared
- Summary and suggestions areas reset
- Button shows "Clearing..." then "Cleared!"

---

### Feature: Markdown Rendering

**Location:** Summary and suggestion output areas

**Test:**
1. Generate any summary or analysis
2. Look for formatted elements

**Expected:**
- Bold text appears bold
- Bullet points are formatted
- Links are clickable
- Line breaks are preserved
- Headers are styled

---

## Expected Results

### Performance Benchmarks

| Action | Expected Time | Notes |
|--------|---------------|-------|
| Extension popup open | < 1 second | Instant on modern systems |
| AI status check | < 2 seconds | Checks availability |
| Page analysis | 3-10 seconds | Depends on content length |
| Summarization | 5-15 seconds | Depends on content length |
| History refresh | < 1 second | Reads from local storage |
| Model download | 10-30 minutes | One-time, ~22 GB |

### Quality Expectations

**Good Summaries:**
- Capture key information accurately
- Are coherent and readable
- Match the selected summary type
- Work best on articles with 500-5000 words

**Good Analysis:**
- Relates to current task
- References browsing context when relevant
- Provides actionable insights
- May include personality/humor

**Limitations to Note:**
- Very short pages may produce minimal summaries
- Dynamic SPAs may not extract content well
- Chrome internal pages (`chrome://`) cannot be accessed
- Model quality varies - it's on-device AI, not GPT-4

---

## Common Issues & Solutions

### Issue: "AI APIs not available"

**Symptoms:**
- Red status indicator
- Cannot use any AI features

**Solutions:**
1. Verify Chrome version is 138+ at `chrome://settings/help`
2. Go to `chrome://flags` and enable required flags
3. **Fully restart Chrome** (close all windows, reopen)
4. Reload extension at `chrome://extensions`
5. Check system requirements (RAM, storage)

---

### Issue: "AI Model needs to be downloaded"

**Symptoms:**
- Yellow status indicator
- "Download AI Model" button visible

**Solutions:**
1. Click "Download AI Model" button (provides required user activation)
2. Wait for download to complete (~22 GB, 10-30 minutes)
3. Ensure stable internet connection
4. Check you have 22+ GB free disk space
5. Use unmetered connection if possible

---

### Issue: Summarization/Analysis Returns Error

**Symptoms:**
- Red error message appears
- "Could not extract page content"

**Solutions:**
1. Refresh the page and try again
2. Ensure page has readable text content
3. Try a different page (some pages block content scripts)
4. Check if you're on a `chrome://` page (not supported)
5. Inspect console for specific error messages

---

### Issue: Summary is Generic or Low Quality

**Symptoms:**
- Summary doesn't capture key points
- Analysis is too generic

**Solutions:**
1. This is expected behavior - on-device AI has limitations
2. Try a different summary type
3. Ensure page has substantial content (500+ words ideal)
4. Set a more specific task for better context
5. Works best on well-structured articles, not landing pages

---

### Issue: Extension Not Responding

**Symptoms:**
- Buttons don't work
- Popup doesn't open

**Solutions:**
1. Reload extension at `chrome://extensions`
2. Click "Refresh" icon on the extension card
3. Check browser console for errors
4. Try removing and re-adding the extension
5. Ensure all required files are present

---

### Issue: Content Script Not Injecting

**Symptoms:**
- "Cannot access this page" error
- Content extraction fails

**Solutions:**
1. This is normal for `chrome://` pages and extension pages
2. Try the extension on regular websites (http/https)
3. Refresh the target page
4. Extension will automatically inject content script when needed

---

### Issue: Browsing History Not Updating

**Symptoms:**
- Analyzed pages don't appear in history
- History is empty after analysis

**Solutions:**
1. Click "Refresh History" button
2. Check that summarization completed successfully
3. Only summarized pages are saved to history (not just analysis)
4. History limited to last 10 pages

---

## Evaluation Checklist

Use this checklist to systematically evaluate all features:

### Installation & Setup
- [ ] Extension loads without errors
- [ ] Icons display correctly
- [ ] AI status shows "Ready" after model download
- [ ] Popup opens when clicking extension icon

### Core Features
- [ ] Current task can be set and updated
- [ ] Page analysis generates relevant suggestions
- [ ] All 4 summary types work (TL;DR, Key Points, Teaser, Headline)
- [ ] Summaries are accurate and well-formatted
- [ ] Markdown rendering works correctly

### Context & Memory
- [ ] Browsing history stores analyzed pages
- [ ] History shows correct timestamps
- [ ] Context influences later suggestions
- [ ] Clear All successfully removes history
- [ ] History limited to 10 pages

### User Experience
- [ ] UI is responsive and intuitive
- [ ] Loading states are clear
- [ ] Error messages are helpful
- [ ] Buttons provide feedback (loading, success states)
- [ ] No crashes or freezes during normal use

### AI Quality
- [ ] Summaries capture key information
- [ ] Analysis is contextually relevant
- [ ] Task awareness improves suggestions
- [ ] Output is coherent and readable
- [ ] Performance is acceptable (< 15 sec per operation)

### Privacy & Security
- [ ] No external network requests (except model download)
- [ ] Data stored locally only
- [ ] No personal information collected
- [ ] Appropriate permissions requested

### Documentation
- [ ] README is comprehensive
- [ ] Installation guide is clear
- [ ] Usage examples are helpful
- [ ] Testing guide is thorough
- [ ] License is included

---

## Performance Testing

If you want to stress-test the extension:

### Test 1: Large Content
- Visit a very long article (5000+ words)
- Attempt to summarize
- Expected: May take longer (10-15 sec), may truncate content

### Test 2: Multiple Tabs
- Open extension in multiple tabs simultaneously
- Test if state is maintained correctly
- Expected: Each tab operates independently

### Test 3: Rapid Operations
- Click Analyze multiple times quickly
- Click Summarize while analysis is running
- Expected: Buttons should disable during processing

---

## Feedback for Developers

When reporting issues or providing feedback, please include:

1. **Chrome version** - From `chrome://settings/help`
2. **Operating system** - Windows/Mac/Linux version
3. **AI flag status** - Screenshot from `chrome://flags`
4. **Console errors** - From browser console (F12)
5. **Steps to reproduce** - Exact sequence that caused issue
6. **Expected vs actual behavior** - What should happen vs what happened

---

## Additional Resources

- **Installation Guide:** [INSTALLATION.md](INSTALLATION.md)
- **Usage Guide:** [USAGE.md](USAGE.md)
- **Chrome AI API Docs:** https://developer.chrome.com/docs/ai/
- **Project README:** [README.md](README.md)

---

## Final Notes for Judges

**What Makes This Extension Special:**

1. **Fully Local AI** - All processing happens on-device, no cloud dependencies
2. **Context Awareness** - Remembers your browsing journey and connects information
3. **Task-Oriented** - Adapts suggestions based on what you're trying to accomplish
4. **Privacy-First** - No data leaves your device
5. **Modern Chrome APIs** - Demonstrates cutting-edge browser capabilities

**Known Limitations:**
- Requires Chrome 138+ with experimental flags
- Large model download (22 GB) needed
- On-device AI is less powerful than cloud models
- Content extraction may fail on some dynamic sites

**Best Testing Approach:**
1. Start with Scenario 1 (Research Workflow)
2. Test all 4 summary types
3. Build context with 5+ pages
4. Observe how suggestions improve with context
5. Try different task descriptions

Thank you for testing **Browse With Me**! We hope this guide makes evaluation straightforward and enjoyable.
