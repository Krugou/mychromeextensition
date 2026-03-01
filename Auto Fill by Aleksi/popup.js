document.addEventListener('DOMContentLoaded', () => {
  const urlPatternInput = document.getElementById('urlPattern');
  const cssSelectorInput = document.getElementById('cssSelector');
  const fillValueInput = document.getElementById('fillValue');
  const addRuleBtn = document.getElementById('addRuleBtn');
  const rulesList = document.getElementById('rulesList');
  const emptyMessage = document.getElementById('emptyMessage');
  const fillPresetSelect = document.getElementById('fillPreset');

  const presets = {
    email: { url: '*://*/*', selector: 'input[type="email"]', value: 'YOUR_EMAIL@domain.com' },
    password: { url: '*://*/*', selector: 'input[type="password"]', value: 'YOUR_PASSWORD' },
    search: { url: '*://*/*', selector: 'input[type="search"], input[name="q"]', value: 'Add Your Keyword Here' },
    username: { url: '*://*/*', selector: 'input[name="username"]', value: 'YOUR_USERNAME' }
  };

  fillPresetSelect.addEventListener('change', () => {
    const p = presets[fillPresetSelect.value];
    if (p) {
      urlPatternInput.value = p.url;
      cssSelectorInput.value = p.selector;
      fillValueInput.value = p.value;
      fillPresetSelect.value = ''; // Reset select back to default
    }
  });

  function loadRules() {
    chrome.storage.sync.get({ autoFillRules: [] }, (data) => {
      rulesList.innerHTML = '';
      if (data.autoFillRules.length === 0) {
        emptyMessage.style.display = 'block';
      } else {
        emptyMessage.style.display = 'none';
        data.autoFillRules.forEach((rule, index) => {
          const li = document.createElement('li');
          li.className = 'rule-item';

          const info = document.createElement('div');
          info.className = 'rule-info';
          info.innerHTML = `
            <strong>${rule.urlPattern}</strong>
            <span>Selector: ${rule.cssSelector}</span>
            <span>Fill: "${rule.fillValue}"</span>
          `;

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Remove';
          deleteBtn.className = 'btn-delete';
          deleteBtn.onclick = () => deleteRule(index);

          li.appendChild(info);
          li.appendChild(deleteBtn);
          rulesList.appendChild(li);
        });
      }
    });
  }

  addRuleBtn.addEventListener('click', () => {
    const pattern = urlPatternInput.value.trim();
    const selector = cssSelectorInput.value.trim();
    const fillTxt = fillValueInput.value.trim();

    if (pattern && selector && fillTxt) {
      chrome.storage.sync.get({ autoFillRules: [] }, (data) => {
        const newRules = [...data.autoFillRules, {
          urlPattern: pattern,
          cssSelector: selector,
          fillValue: fillTxt
        }];
        chrome.storage.sync.set({ autoFillRules: newRules }, () => {
          urlPatternInput.value = '';
          cssSelectorInput.value = '';
          fillValueInput.value = '';
          loadRules();
        });
      });
    } else {
      alert('Please fill out all fields: URL Pattern, CSS Selector, and Text.');
    }
  });

  function deleteRule(index) {
    chrome.storage.sync.get({ autoFillRules: [] }, (data) => {
      data.autoFillRules.splice(index, 1);
      chrome.storage.sync.set({ autoFillRules: data.autoFillRules }, () => {
        loadRules();
      });
    });
  }

  loadRules();
});
