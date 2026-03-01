function matchUrl(pattern, currentUrl) {
  try {
    const regexStr = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');
    const regex = new RegExp(`^${regexStr}$`, 'i');
    return regex.test(currentUrl);
  } catch (e) {
    return false;
  }
}

function processAutoFill(rules) {
  const currentUrl = window.location.href;
  const activeRules = rules.filter(r => matchUrl(r.urlPattern, currentUrl));

  if (activeRules.length === 0) return;

  console.log('[Auto Fill] Found active rules for this page:', activeRules);

  const attemptFill = () => {
    activeRules.forEach(rule => {
      const elements = document.querySelectorAll(rule.cssSelector);
      elements.forEach(el => {
        // If the element expects a value (like an input or textarea)
        if (el.value === '' && !el.dataset.autoFilled) {
          el.value = rule.fillValue;
          el.dataset.autoFilled = 'true';

          // Dispatch input and change events so modern frameworks like React/Vue pick up the change
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));

          console.log(`[Auto Fill] Filled element targeted by "${rule.cssSelector}"`);
        }
      });
    });
  };

  // Attempt right away
  attemptFill();

  // Watch for dynamic DOM changes (e.g. SPAs rendering inputs later)
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    for (let mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldCheck = true;
        break;
      }
    }
    if (shouldCheck) {
      attemptFill();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

chrome.storage.sync.get({ autoFillRules: [] }, (data) => {
  if (data.autoFillRules && data.autoFillRules.length > 0) {
    processAutoFill(data.autoFillRules);
  }
});
