# Elena Portfolio

Static portfolio site built with Vite and React.

## Localization
Translations are stored as JSON files in `public/i18n`. The app lazily fetches the selected locale and merges it with the English baseline to ensure missing keys fall back gracefully. Static JSON requests honor Vite's `base` path so assets resolve correctly on subpaths.

## Development
- `npm run dev` – start the local dev server.
- `npm run build` – build for production.
- `npm test` – run node-based sanity checks to confirm locale files share the same shape and JSON assets parse correctly.

## Assets
- Images under `public/images` are tracked directly in Git (no LFS) so they publish cleanly to GitHub Pages and other static hosts.
- The GitHub Actions build asserts that required images land in `dist/images` to avoid missing assets during deploys.

## Contact form
- The contact form validates required fields client-side and surfaces inline errors with ARIA announcements.
- Submissions post to Web3Forms at `https://api.web3forms.com/submit`.
- Provide `VITE_WEB3FORMS_ACCESS_KEY` in your environment to enable submissions; there are no baked-in fallback keys.
- Enable hCaptcha spam protection by setting `VITE_HCAPTCHA_SITE_KEY`; the React hCaptcha widget renders inside the Web3Forms form, posting the site key and verification token with each submission.
