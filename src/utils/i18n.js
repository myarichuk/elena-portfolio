import { assetUrl } from './assets';

export const mergeWithFallback = (base, override) => {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base;
  }

  if (typeof base !== 'object' || base === null) {
    return override ?? base;
  }

  return Object.keys(base).reduce((acc, key) => {
    acc[key] = mergeWithFallback(base[key], override?.[key]);
    return acc;
  }, {});
};

export const fetchLocale = async (locale) => {
  const originUrl = new URL(`i18n/${locale}.json`, window.location.origin).toString();
  const baseUrl = assetUrl(`i18n/${locale}.json`);
  const candidates = originUrl === baseUrl ? [originUrl] : [originUrl, baseUrl];
  let lastError;

  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      lastError = error;
      console.warn(`Failed to load ${locale} translations from ${url}`, error);
    }
  }

  throw new Error(`Failed to load ${locale} translations${lastError ? ` (${lastError.message})` : ''}`);
};
