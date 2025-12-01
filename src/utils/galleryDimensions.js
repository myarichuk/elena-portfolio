export const FALLBACK_DIMENSIONS = { width: 1600, height: 2000 };

export const getItemDimensions = (dimensionsMap, artId) =>
  dimensionsMap[artId] || FALLBACK_DIMENSIONS;
