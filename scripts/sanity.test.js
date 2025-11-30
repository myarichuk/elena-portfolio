import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

const localesDir = path.join(process.cwd(), 'public', 'i18n');
const locales = ['en', 'ru', 'he'];

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const compareShape = (base, candidate, trail = 'root') => {
  if (Array.isArray(base)) {
    assert(Array.isArray(candidate), `Expected array at ${trail}`);
    return;
  }

  if (typeof base !== 'object' || base === null) {
    assert.notStrictEqual(candidate, undefined, `Missing value at ${trail}`);
    return;
  }

  Object.keys(base).forEach((key) => {
    assert(candidate && Object.prototype.hasOwnProperty.call(candidate, key), `Missing key '${key}' at ${trail}`);
    compareShape(base[key], candidate[key], `${trail}.${key}`);
  });
};

describe('Sanity Check', () => {
  test('locale files parse cleanly', () => {
    locales.forEach((locale) => {
      const filePath = path.join(localesDir, `${locale}.json`);
      assert.doesNotThrow(() => readJson(filePath), `Locale ${locale} failed to parse`);
    });
  });

  test('locale files share the same shape', () => {
    const baseLocale = readJson(path.join(localesDir, 'en.json'));
    locales.forEach((locale) => {
      const candidate = readJson(path.join(localesDir, `${locale}.json`));
      compareShape(baseLocale, candidate, locale);
    });
  });

  test('artworks JSON is valid and typed', () => {
    const artworksPath = path.join(process.cwd(), 'public', 'artworks.json');
    const artworks = readJson(artworksPath);

    assert(Array.isArray(artworks), 'Artworks should be an array');
    assert(artworks.length > 0, 'Artworks should not be empty');

    artworks.forEach((artwork, index) => {
      const trail = `artworks[${index}]`;
      ['id', 'title', 'category', 'src'].forEach((key) => {
        assert(Object.prototype.hasOwnProperty.call(artwork, key), `Missing ${key} in ${trail}`);
      });

      assert.strictEqual(typeof artwork.id, 'number', `Expected numeric id in ${trail}`);
      assert.strictEqual(typeof artwork.title, 'string', `Expected string title in ${trail}`);
      assert.strictEqual(typeof artwork.category, 'string', `Expected string category in ${trail}`);
      assert.strictEqual(typeof artwork.src, 'string', `Expected string src in ${trail}`);
    });
  });
});
