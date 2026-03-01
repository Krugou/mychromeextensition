# Auto Fill Extension for Aleksi

This is a custom Google Chrome extension built to automatically fill input fields on specific websites with designated text.

## Features
- Add multiple auto-fill rules.
- Filter by wildcard-enabled URL matching (e.g., `*://*.google.com/*`).
- Target specific inputs using precise CSS selectors.
- Works dynamically even if the page loads items lazily using `MutationObserver`.

## Installation Instructions

1. **Open Chrome Extensions Page**:
   Open Google Chrome and type `chrome://extensions/` into the address bar, then hit Enter.

2. **Enable Developer Mode**:
   In the top right corner of the Extensions page, toggle the **"Developer mode"** switch so it is turned ON.

3. **Load the Extension**:
   - Click the **"Load unpacked"** button that appears in the top left.
   - Navigate into the `Auto Fill by Aleksi` folder and Select it.

4. **Pin the Extension**:
   - Click the "Puzzle" icon in the top right of your Chrome browser.
   - Find "Auto Fill by Aleksi" and pin it.

## How to use CSS Selectors
To auto-fill an input, the extension needs a way to find it. You can provide a custom identifier using a CSS Selector.
- **By ID**: If an input is `<input id="email">`, the selector is `#email`
- **By Name**: `<input name="q">`, the selector is `input[name="q"]`
- **By Class**: `<input class="search-box">`, the selector is `.search-box`

## Adding a Rule
1. Open the popup.
2. Enter the **URL Pattern** (Ex: `https://www.google.com/`)
3. Enter the **CSS Selector** (Ex: `textarea[title="Search"]`)
4. Enter the **Text to Auto-Fill** (Ex: `Hello world`)
5. Click **Add Auto Fill Rule**, then load the target page. The text will appear automatically in the field.
