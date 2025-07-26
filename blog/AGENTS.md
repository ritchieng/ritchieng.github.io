# `AGENTS.md`

## Usage

- **Maintain consistent Bash theme**:
  - Ensure alignment and visual consistency with `./about/index.html`.
  - Follow Bash-style prompts and outputs clearly.

- **Menu Inclusion**:
  - Every `index.html` must include the navigation menu:

```html
<div id="menu"></div>
<script src="../menu.js"></script>
```

- **Folder Structure**:
  - Create new pages in individual folders, following this structure:

```
new_page_name/
├── index.html
└── app.js (optional)
```

## JavaScript & Styling

- **JavaScript**:
  - Utilize plain JavaScript only; no external libraries except Tailwind CSS.
  - Optional JavaScript should be placed in a separate file named `app.js` within each page's folder.

- **CSS & Tailwind**:
  - Use Tailwind CSS extensively for rapid styling and responsive design.
  - Custom CSS modifications or overrides should be made within:

```
css/styles.css
```

- Example inclusion in `index.html`:

```html
<link rel="stylesheet" href="../../css/styles.css">
<script src="../../lib/tailwind/tailwind-cdn.js"></script>
```

## Custom CSS Improvements

- Periodically review and improve `styles.css` to maintain modern, minimal, and consistent appearance.
- Ensure alignment, padding, margins, and color consistency across pages.

---

**Consistency Checklist:**

- [ ] Menu inclusion (`menu.js`)
- [ ] Folder structure (`new_page_name/index.html`, optional `app.js`)
- [ ] Alignment matches bash theme from `./about/index.html`
- [ ] Use of Tailwind CSS and plain JavaScript
- [ ] Custom CSS (`css/styles.css`) maintained and optimized
