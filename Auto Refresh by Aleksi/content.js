function checkAndRefresh() {
  chrome.storage.sync.get({ rules: [] }, (data) => {
    const currentUrl = window.location.href;
    const rule = data.rules.find(r => {
      try {
        // Escape regex special chars except * and convert * to .*
        const regexStr = r.urlPattern
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*');
        const regex = new RegExp(`^${regexStr}$`, 'i');
        return regex.test(currentUrl);
      } catch (e) {
        return false;
      }
    });

    if (rule && rule.timerSeconds > 0) {
      console.log(`[Auto Refresher] Refreshing this page in ${rule.timerSeconds} seconds...`);

      let timeLeft = rule.timerSeconds;

      // Create visual indicator
      const indicator = document.createElement('div');
      indicator.style.position = 'fixed';
      indicator.style.bottom = '10px';
      indicator.style.left = '10px';
      indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
      indicator.style.color = '#fff';
      indicator.style.padding = '6px 12px';
      indicator.style.borderRadius = '4px';
      indicator.style.zIndex = '2147483647'; // Max z-index
      indicator.style.fontFamily = 'monospace';
      indicator.style.fontSize = '12px';
      indicator.style.pointerEvents = 'none';
      indicator.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
      indicator.innerHTML = `🔄 Auto Refresh in ${timeLeft}s`;
      document.body.appendChild(indicator);

      // Countdown timer
      const timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
          indicator.innerHTML = `🔄 Auto Refresh in ${timeLeft}s`;
        } else {
          indicator.innerHTML = `🔄 Refreshing now...`;
          clearInterval(timerInterval);
        }
      }, 1000);

      // Actual page reload
      setTimeout(() => {
        window.location.reload();
      }, rule.timerSeconds * 1000);
    }
  });
}

checkAndRefresh();
