import assert from 'assert';
import { describe, it } from 'node:test';
import { FALLBACK_DIMENSIONS, getItemDimensions } from '../src/utils/galleryDimensions.js';

describe('getItemDimensions', () => {
  it('returns provided dimensions when present', () => {
    const map = { 1: { width: 800, height: 600 } };
    assert.deepStrictEqual(getItemDimensions(map, 1), map[1]);
  });

  it('falls back to default dimensions when missing', () => {
    const map = {};
    assert.deepStrictEqual(getItemDimensions(map, 99), FALLBACK_DIMENSIONS);
  });
});
