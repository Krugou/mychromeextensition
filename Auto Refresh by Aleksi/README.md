# Auto Refresh Chrome Extension for Aleksi

This is a custom Google Chrome extension built for Aleksi. It allows you to set custom refresh timers for specific websites based on URL patterns. For example, you can set `www.google.com/*` to automatically refresh every X seconds.

## Features
- Add multiple refresh rules for different websites.
- Use wildcards (`*`) to match various parts of a URL.
- Specify custom refresh intervals (in seconds) for each rule.
- Easy-to-use popup interface to manage your active rules.

## Installation Instructions

Follow these steps to install the extension in Google Chrome:

1. **Download or Clone the Repository**:
   Make sure you have this entire project folder downloaded to your computer (e.g., `C:\Users\moxch\Documents\GitHub\mychromeextensition`).

2. **Open Chrome Extensions Page**:
   Open Google Chrome and type `chrome://extensions/` into the address bar, then hit Enter.

3. **Enable Developer Mode**:
   In the top right corner of the Extensions page, toggle the **"Developer mode"** switch so it is turned ON.

4. **Load the Extension**:
   - Click the **"Load unpacked"** button that appears in the top left.
   - A file dialog will open. Navigate to the folder where this project is located (`mychromeextensition`).
   - Select the folder.

5. **Pin the Extension (Optional but recommended)**:
   - Click the "Puzzle" icon in the top right of your Chrome browser (next to your profile picture).
   - Find "Auto Refresh by Aleksi" in the list and click the "Pin" icon next to it so it stays visible in your toolbar.

## How to Use

1. Click the **Auto Refresh by Aleksi** icon in your Chrome toolbar to open the settings popup.
2. In the **URL Pattern** field, enter the website you want to target.
   - *Pro Tip*: Use `*` as a wildcard.
   - Example 1: `*://*.google.com/*` will match all Google pages.
   - Example 2: `https://news.ycombinator.com/*` will match all Hacker News pages.
3. In the **Refresh Interval** field, enter the number of seconds you want to wait before the page refreshes (e.g., `5` for 5 seconds).
4. Click **Add Rule**. The rule will appear in the list below.
5. Navigate to a website that matches your rule. The extension will automatically refresh the page based on your set timer.

## Managing Rules
- To remove a rule, simply open the extension popup and click the red **Remove** button next to the rule you want to delete.

## Troubleshooting
- If the extension isn't working, make sure the URL pattern you entered matches the URL of the tab exactly.
- Keep the Chrome developer console (`F12` -> Console) open to see logs, such as: `[Auto Refresher] Refreshing this page in X seconds...`