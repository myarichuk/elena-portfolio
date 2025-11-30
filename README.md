# Elena Portfolio

Static portfolio site built with Vite and React.

## Localization
Translations are stored as JSON files in `public/i18n`. The app lazily fetches the selected locale and merges it with the English baseline to ensure missing keys fall back gracefully. Static JSON requests honor Vite's `base` path so assets resolve correctly on subpaths.

## Development
- `npm run dev` – start the local dev server.
- `npm run build` – build for production.
- `npm test` – run node-based sanity checks to confirm locale files share the same shape and JSON assets parse correctly.

## Assets
- Images under `public/images` are tracked with Git LFS to keep the repository lean while serving optimized assets.

## Contact form
- The contact form validates required fields client-side and surfaces inline errors with ARIA announcements.
- Successful submissions compose a `mailto:` link (default: `hello@elenayarichuk.com`) so the page stays fully static for GitHub Pages hosting.
