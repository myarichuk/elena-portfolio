# Elena Portfolio

Static portfolio site built with Vite, React, and Tailwind CSS. This is a personal portfolio and is not intended for general-purpose reuse or redistribution.

## Getting started
- Install dependencies with `npm install` (Node 18+ recommended).
- `npm run dev` – start the local dev server.
- `npm run build` – compile an optimized production bundle.
- `npm run preview` – serve the production build locally for smoke testing.
- `npm test` – run node-based sanity checks to confirm locale files share the same shape and JSON assets parse correctly.

## Localization
Translations are stored as JSON files in `public/i18n`. The app lazily fetches the selected locale and merges it with the English baseline to ensure missing keys fall back gracefully. Static JSON requests honor Vite's `base` path so assets resolve correctly on subpaths.

## Development notes
Vite provides the dev server and bundling, with React components styled via Tailwind utility classes. No backend services are bundled; the site deploys as static assets.

### Lightbox usage
- Gallery items open through [`react-photoswipe-gallery`](https://github.com/igordanchenko/react-photoswipe-gallery), which handles keyboard navigation, zooming, and swipe gestures out of the box.
- Provide meaningful `title`, `category`, and `details` fields in `data/artworks.json` so captions and alt text stay helpful; these feed PhotoSwipe captions.

## Assets
- Images under `public/images` are tracked directly in Git (no LFS) so they publish cleanly to GitHub Pages and other static hosts.
- The GitHub Actions build asserts that required images land in `dist/images` to avoid missing assets during deploys.

## Contact form
- The contact form validates required fields client-side and surfaces inline errors with ARIA announcements.
- Validation messages are sourced from the active locale so field errors (including topic selection) stay translated.
- Submissions post to Web3Forms at `https://api.web3forms.com/submit`.
- Provide `VITE_WEB3FORMS_ACCESS_KEY` in your environment to enable submissions; there are no baked-in fallback keys.
- Enable hCaptcha spam protection by setting `VITE_HCAPTCHA_SITE_KEY`; the React hCaptcha widget renders inside the Web3Forms form, posting the site key and verification token with each submission.
