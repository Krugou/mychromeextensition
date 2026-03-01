---
description: Generate a portfolio page (index.html) of all extensions
---

# Generate Chrome Extension Portfolio Page

This workflow generates a beautifully designed, responsive `index.html` file in the root of the repository. It acts as a portfolio page for all Chrome Extensions.

// turbo-all
1. Use `find_by_name` to search for all `manifest.json` files in the repository (excluding `node_modules` or `.agents`).
2. Read each `manifest.json` file using `view_file`.
3. Extract the following information from each manifest:
   - `name`: The title of the extension.
   - `description`: A brief summary of what the extension does.
   - `icons`: Look for the path to the 128px icon (usually `icon.png`).
4. Construct a responsive, modern HTML page (`index.html` in the root directory) that loops through all discovered extensions and displays them as cards in a CSS Grid.
   - Each card should display the extracted icon, name, and description.
   - Each card should link directly to the extension's folder (use a relative path like `./[Extension Folder Name]`).
   - Use a sleek, modern UI (e.g., dark mode, glassmorphism, nice hover effects). Add internal CSS directly to the `<head>` of the `index.html` file.
5. Create or overwrite the `index.html` file in the root of the `mychromeextensition` directory with the constructed HTML content using `write_to_file` with Overwrite set to true.
6. Verify the file was created successfully.
