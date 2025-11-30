# Elena Portfolio

Static portfolio site built with Vite and React.

## Localization
Translations are stored as JSON files in `public/i18n`. The app lazily fetches the selected locale and merges it with the English baseline to ensure missing keys fall back gracefully. Static JSON requests honor Vite's `base` path so assets resolve correctly on subpaths.

## Development
- `npm run dev` – start the local dev server.
- `npm run build` – build for production.
- `npm test` – run locale sanity checks to confirm locale files share the same shape.
