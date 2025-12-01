export const assetUrl = (path) => {
  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
};

export const resolveImageSrc = (src, { upscale } = {}) => {
  if (/^https?:\/\//.test(src)) {
    if (upscale) {
      return src.replace('w=800', 'w=1200');
    }
    return src;
  }

  return assetUrl(src);
};
