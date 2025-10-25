// Content script for Browse With Me extension
// Extracts page content and injects copilot UI

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageContent') {
    console.log("Content script received getPageContent request");
    const content = extractPageContent();
    sendResponse({ content });
  }
  return true;
});

// Extract meaningful content from the page
function extractPageContent() {
  // Get page title
  const title = document.title;

  // Get meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  const description = metaDescription ? metaDescription.content : '';

  // Get main content - try to find the main content area
  let mainContent = '';

  // Try common content containers
  const contentSelectors = [
    'main',
    'article',
    '[role="main"]',
    '.content',
    '.main-content',
    '#content',
    '#main-content',
    'body'
  ];

  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      mainContent = extractTextContent(element);
      if (mainContent.length > 100) {
        break;
      }
    }
  }

  // Get all headings for structure
  const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
    .map(h => h.textContent.trim())
    .filter(text => text.length > 0)
    .slice(0, 10)
    .join(' | ');

  // Combine all content
  const fullContent = `
Title: ${title}
${description ? `Description: ${description}` : ''}
${headings ? `Headings: ${headings}` : ''}

Content:
${mainContent.substring(0, 5000)}
  `.trim();

  return fullContent;
}

// Extract text content from an element, excluding script and style tags
function extractTextContent(element) {
  const clone = element.cloneNode(true);

  // Remove script, style, and other non-content elements
  const elementsToRemove = clone.querySelectorAll('script, style, nav, header, footer, iframe, noscript');
  elementsToRemove.forEach(el => el.remove());

  // Get text content and clean it up
  let text = clone.textContent || '';

  // Remove extra whitespace
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  return text;
}

// Simple markdown to HTML converter for basic formatting
function simpleMarkdownToHtml(text) {
  if (!text) return '';

  // Escape HTML first to prevent XSS
  const escapeHtml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  let html = escapeHtml(text);

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Code: `code`
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');

  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return html;
}

// Optional: Create a floating copilot UI on the page
function createCopilotUI() {
  // Check if already created
  if (document.getElementById('browse-with-me-copilot')) {
    return;
  }

  const copilotDiv = document.createElement('div');
  copilotDiv.id = 'browse-with-me-copilot';
  copilotDiv.innerHTML = `
    <div id="copilot-toggle" title="Browse With Me Copilot">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    </div>
    <div id="copilot-panel" style="display: none;">
      <div id="copilot-header">
        <h3>Wisdom Copilot</h3>
        <button id="copilot-close">×</button>
      </div>
      <div id="copilot-content">
        <p>Click the extension icon to get AI-powered insights!</p>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #browse-with-me-copilot {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    #copilot-toggle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #1a73e8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    #copilot-toggle:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    #copilot-panel {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 320px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }

    #copilot-header {
      background: #1a73e8;
      color: white;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #copilot-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    #copilot-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #copilot-content {
      padding: 16px;
      max-height: 300px;
      overflow-y: auto;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(copilotDiv);

  // Setup event listeners
  const toggle = document.getElementById('copilot-toggle');
  const panel = document.getElementById('copilot-panel');
  const closeBtn = document.getElementById('copilot-close');
  const content = document.getElementById('copilot-content');

  toggle.addEventListener('click', async () => {
    const isVisible = panel.style.display !== 'none';

    if (isVisible) {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'block';

      // Generate ironic/humorous comment about the page
      content.innerHTML = '<p style="color: #666; font-style: italic;">Generating witty observation...</p>';

      try {
        const pageContent = extractPageContent();
        const result = await chrome.runtime.sendMessage({
          action: 'generateSuggestion',
          pageContext: pageContent,
          specialInstructions: 'role play Tree of Wisdom in PVZ, say something witty, ironic, or humorous about this webpage in 1-2 sentences. No hard feelings, just fun!',
          url: window.location.href
        });

        if (result.error) {
          content.innerHTML = `<p style="color: #dc3545;">${result.error}</p>`;
        } else {
          // Render markdown formatting in the suggestion
          const renderedSuggestion = simpleMarkdownToHtml(result.suggestion);
          content.innerHTML = `<div style="font-style: italic; color: #1a73e8;">💭 ${renderedSuggestion}</div>`;
        }
      } catch (error) {
        console.error('Error generating comment:', error);
        content.innerHTML = '<p style="color: #dc3545;">Oops! My witty circuits are temporarily offline. Try the extension popup instead!</p>';
      }
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.style.display = 'none';
  });
}

// Initialize copilot UI when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createCopilotUI);
} else {
  createCopilotUI();
}
