---
description: Create a new custom Chrome Extension
---

# Create a new custom Chrome Extension

This template scaffolds out a standard Manifest V3 Chrome Extension.

// turbo-all
1. Create the new Chrome Extension directory based on the user's name preference
   ```pwsh
   mkdir "New Extension by Aleksi"
   ```
2. Create the `manifest.json` file inside the new directory with `write_to_file`. Ensure it includes a description and an action icon.
3. Generate the required background or content scripts using `write_to_file`.
4. Generate graphical assets using the AI image generation tool `generate_image`:
   - An icon `icon.png` (a simple, modern, flat vector logo).
   - A promotional banner `promo.png` (1400x560 width, no text, beautiful wide scene).
   - Copy both generated images into the extension directory.
5. Create a `README.md` to document the new extension. Ensure to automatically include **Chrome Web Store Listing Details** inside the README.md so the user can easily copy and paste them:
   - **Title & Description:** Clear title and detailed description.
   - **Category:** (e.g. Productivity, Developer Tools).
   - **Privacy Practices - Single Purpose:** Explain the single purpose.
   - **Privacy Practices - Permission Justification:** Explain why any requested permissions are needed.
   - **Privacy Practices - Data Usage:** Confirm compliance with Chrome's Limited Use policy and what data is collected.
