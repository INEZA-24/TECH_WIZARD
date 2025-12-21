<!-- .github/copilot-instructions.md - Project-specific guidance for AI coding agents -->
# Copilot instructions — TECH_WIZARD

This repository is a small, static personal portfolio built from plain HTML/CSS/JS. The goal of these instructions is to help an AI coding agent become productive quickly by describing the project's structure, patterns, gotchas, and common developer tasks.

- **Big picture:** A multi-page static site (root HTML files: `index.html`, `aboutus.html`, `skills.html`, `certifications.html`, `new.html`) with assets under `css/`, `images/`, and `script/`. Pages are hand-written, responsive, and rely on CSS variables and small vanilla JS for interactivity (no build tools or frameworks).

- **Key files/directories:**
  - `index.html` — homepage template (hero, navigation, footer). Shows primary patterns for layout and linking.
  - `css/index.css` — global styles, declares CSS variables (`--primary`, `--dark`, etc.) and responsive breakpoints. Use it as the canonical source for colors, spacing, and utility class names (`.container`, `.btn`, `.nav-links`, `.hamburger`).
  - `script/portifolio.js` — site JS (mobile nav, smooth scrolling, active link logic, simple form handlers). Note: `index.html` currently references `portifolio.js` at the repo root instead of `script/portifolio.js`.
  - `images/` — media files. Some filenames contain spaces (e.g., `images/my profile.png`) which can break some tools/servers; prefer dash/underscore-separated names when adding or renaming images.

- **Patterns & conventions discovered:**
  - Design system is CSS variable driven; prefer edits in `css/index.css` for color or spacing changes.
  - Component-like class names are used (e.g., `.hero`, `.stat-card`, `.about-stats-container`) — follow these when adding new markup.
  - Navigation expects anchor links to sections (`section#home`, `section#about`, etc.). JS computes active links by section `id` values.

- **Common issues & gotchas (actionable):**
  - Script path mismatch: `index.html` includes `<script src="portifolio.js"></script>` but the JS lives at `script/portifolio.js`. Either update `index.html` to `script/portifolio.js` or move the file. Expect console `404` errors otherwise.
  - Image filenames with spaces (e.g., `my profile.png`) may not load on some servers; normalize names when adding assets.
  - No build/test system: serving the folder via a static server is required to exercise fonts/CDNs and relative paths.

- **How to run and debug locally:**
  - Quick local preview (from repository root):

    ```bash
    python3 -m http.server 8000
    # or
    npx http-server -p 8000
    ```

  - Open `http://localhost:8000/index.html` in the browser, use DevTools Console to see missing asset errors (scripts, images, fonts).
  - Common fixes: correct `src`/`href` paths, rename images to remove spaces, and ensure CDN links (Google Fonts, Font Awesome) are reachable.

- **When editing code (rules for AI changes):**
  - Preserve HTML structure and relative links between pages. If updating a path, update all pages that reference it.
  - Prefer editing `css/index.css` for visual changes rather than adding inline styles; the project relies on CSS variables and responsive breakpoints.
  - Keep JavaScript vanilla and minimal — follow the existing patterns in `script/portifolio.js` (event listeners on `DOMContentLoaded`, query selectors, small DOM updates).

- **Representative examples to follow:**
  - Mobile nav: hamburger toggles `.active` on both `.hamburger` and `.nav-links` (see `script/portifolio.js`).
  - Active link logic: relies on `section` `id` attributes and anchors' `href` values (search for `pageYOffset` in `script/portifolio.js`).

- **Integration & external deps:**
  - Google Fonts and Font Awesome are included via CDN links in `index.html` — offline builds are not configured.
  - Social links are hard-coded in footer; there is no backend or API integration in the current codebase.

If anything above is unclear or you'd like the file expanded with more examples (e.g., automated formatting, suggested link fixes, or a PR to correct the script path), tell me which area to refine and I will update this document.
