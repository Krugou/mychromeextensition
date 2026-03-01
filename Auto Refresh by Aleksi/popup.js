document.addEventListener('DOMContentLoaded', () => {
  const urlPatternInput = document.getElementById('urlPattern');
  const timerSecondsInput = document.getElementById('timerSeconds');
  const addRuleBtn = document.getElementById('addRuleBtn');
  const rulesList = document.getElementById('rulesList');
  const emptyMessage = document.getElementById('emptyMessage');
  const timerPresetSelect = document.getElementById('timerPreset');
  const toggleEditModeBtn = document.getElementById('toggleEditModeBtn');
  const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
  const selectAllContainer = document.getElementById('selectAllContainer');
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');

  let isEditMode = false;
  let currentlyEditingIndex = -1;

  timerPresetSelect.addEventListener('change', () => {
    if (timerPresetSelect.value) {
      timerSecondsInput.value = timerPresetSelect.value;
    }
  });

  function loadRules() {
    chrome.storage.sync.get({ rules: [] }, (data) => {
      rulesList.innerHTML = '';
      if (data.rules.length === 0) {
        emptyMessage.style.display = 'block';
        toggleEditModeBtn.style.display = 'none';
        setEditMode(false);
      } else {
        emptyMessage.style.display = 'none';
        toggleEditModeBtn.style.display = 'block';

        data.rules.forEach((rule, index) => {
          const li = document.createElement('li');
          li.className = 'rule-item';

          if (isEditMode) {
            li.classList.add('edit-mode-active');
          }

          // Checkbox for mass delete
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'rule-checkbox';
          checkbox.dataset.index = index;
          checkbox.addEventListener('change', updateBulkDeleteState);

          const info = document.createElement('div');
          info.className = 'rule-info';
          info.style.flex = '1';

          if (currentlyEditingIndex === index) {
            // Inline edit template
            info.innerHTML = `
              <input type="text" id="editUrl_${index}" class="edit-input" value="${rule.urlPattern}">
              <div style="display: flex; gap: 5px;">
                <input type="number" id="editTimer_${index}" class="edit-input" value="${rule.timerSeconds}" min="1">
                <button class="save-edit-btn">Save</button>
                <button class="cancel-edit-btn">Cancel</button>
              </div>
            `;
            info.querySelector('.save-edit-btn').addEventListener('click', () => saveEdit(index));
            info.querySelector('.cancel-edit-btn').addEventListener('click', () => cancelEdit());
          } else {
            // Normal display
            info.innerHTML = `<strong>${rule.urlPattern}</strong><span>Every ${rule.timerSeconds}s</span>`;
          }

          const actionsBox = document.createElement('div');
          actionsBox.className = 'rule-actions';

          const editBtn = document.createElement('button');
          editBtn.textContent = 'Edit';
          editBtn.className = 'btn-edit';
          editBtn.onclick = () => startEdit(index);

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Remove';
          deleteBtn.className = 'btn-delete';
          deleteBtn.onclick = () => deleteRule(index);

          // Hide individual actions if editing this specific rule
          if (currentlyEditingIndex !== index) {
            actionsBox.appendChild(editBtn);
            actionsBox.appendChild(deleteBtn);
          }

          li.appendChild(checkbox);
          li.appendChild(info);
          li.appendChild(actionsBox);
          rulesList.appendChild(li);
        });

        // Sync select-all checkbox state based on rendered lists
        updateBulkDeleteState();
      }
    });
  }

  addRuleBtn.addEventListener('click', () => {
    const pattern = urlPatternInput.value.trim();
    const timer = parseInt(timerSecondsInput.value, 10);

    if (pattern && timer > 0) {
      chrome.storage.sync.get({ rules: [] }, (data) => {
        const newRules = [...data.rules, { urlPattern: pattern, timerSeconds: timer }];
        chrome.storage.sync.set({ rules: newRules }, () => {
          urlPatternInput.value = '';
          timerSecondsInput.value = '';
          loadRules();
        });
      });
    } else {
      alert('Please enter a valid URL pattern and a timer > 0.');
    }
  });

  function deleteRule(index) {
    chrome.storage.sync.get({ rules: [] }, (data) => {
      data.rules.splice(index, 1);
      chrome.storage.sync.set({ rules: data.rules }, () => {
        loadRules();
      });
    });
  }

  // --- Mass Delete / Edit Mode Logic ---

  function setEditMode(active) {
    isEditMode = active;
    currentlyEditingIndex = -1; // reset inline edits

    if (isEditMode) {
      toggleEditModeBtn.textContent = 'Cancel Edit Mode';
      selectAllContainer.style.display = 'inline-block';
      bulkDeleteBtn.style.display = 'inline-block';
    } else {
      toggleEditModeBtn.textContent = 'Edit Rules';
      selectAllContainer.style.display = 'none';
      bulkDeleteBtn.style.display = 'none';
      selectAllCheckbox.checked = false;
    }

    // Toggle class on all list items
    const listItems = document.querySelectorAll('.rule-item');
    listItems.forEach(li => {
      if (isEditMode) li.classList.add('edit-mode-active');
      else li.classList.remove('edit-mode-active');
    });

    // Uncheck boxes on exit
    if (!isEditMode) {
      const checkboxes = document.querySelectorAll('.rule-checkbox');
      checkboxes.forEach(cb => cb.checked = false);
    }

    updateBulkDeleteState();
    loadRules(); // Re-render to clear any active inline edits
  }

  toggleEditModeBtn.addEventListener('click', () => {
    setEditMode(!isEditMode);
  });

  selectAllCheckbox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const checkboxes = document.querySelectorAll('.rule-checkbox');
    checkboxes.forEach(cb => {
      cb.checked = isChecked;
    });
    updateBulkDeleteState();
  });

  function updateBulkDeleteState() {
    const checkboxes = Array.from(document.querySelectorAll('.rule-checkbox'));
    if (checkboxes.length === 0) return;

    const checkedBoxes = checkboxes.filter(cb => cb.checked);

    // Sync select-all box
    selectAllCheckbox.checked = checkedBoxes.length === checkboxes.length && checkboxes.length > 0;

    // Update bulk delete button text
    if (checkedBoxes.length > 0) {
      bulkDeleteBtn.textContent = `Delete Selected (${checkedBoxes.length})`;
      bulkDeleteBtn.disabled = false;
      bulkDeleteBtn.style.opacity = '1';
    } else {
      bulkDeleteBtn.textContent = `Delete Selected`;
      bulkDeleteBtn.disabled = true;
      bulkDeleteBtn.style.opacity = '0.6';
    }
  }

  bulkDeleteBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.rule-checkbox:checked');
    if (checkboxes.length === 0) return;

    if (confirm(`Are you sure you want to delete ${checkboxes.length} rules?`)) {
      // Get indices to delete, sorting descending so splicing doesn't change subsequent indices
      const indicesToRemove = Array.from(checkboxes)
        .map(cb => parseInt(cb.dataset.index, 10))
        .sort((a, b) => b - a);

      chrome.storage.sync.get({ rules: [] }, (data) => {
        let newRules = data.rules;
        indicesToRemove.forEach(index => {
          newRules.splice(index, 1);
        });

        chrome.storage.sync.set({ rules: newRules }, () => {
          selectAllCheckbox.checked = false;
          setEditMode(false);
          loadRules();
        });
      });
    }
  });

  // --- Inline Edit Logic ---

  function startEdit(index) {
    currentlyEditingIndex = index;
    loadRules(); // Trigger re-render to show input boxes
  }

  function cancelEdit() {
    currentlyEditingIndex = -1;
    loadRules();
  }

  function saveEdit(index) {
    const urlVal = document.getElementById(`editUrl_${index}`).value.trim();
    const timerVal = parseInt(document.getElementById(`editTimer_${index}`).value, 10);

    if (urlVal && timerVal > 0) {
      chrome.storage.sync.get({ rules: [] }, (data) => {
        data.rules[index].urlPattern = urlVal;
        data.rules[index].timerSeconds = timerVal;
        chrome.storage.sync.set({ rules: data.rules }, () => {
          currentlyEditingIndex = -1;
          loadRules();
        });
      });
    } else {
      alert('Please enter a valid URL pattern and a timer > 0.');
    }
  }

  loadRules();
});
