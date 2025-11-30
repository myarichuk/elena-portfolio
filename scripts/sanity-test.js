import fs from 'fs';
import path from 'path';
import assert from 'assert';

const localesDir = path.join(process.cwd(), 'public', 'i18n');
const locales = ['en', 'ru', 'he'];

function readLocale(locale) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function compareShape(base, candidate, trail = 'root') {
  if (Array.isArray(base)) {
    assert(Array.isArray(candidate), `Expected array at ${trail}`);
    return;
  }

  if (typeof base !== 'object' || base === null) {
    assert(candidate !== undefined, `Missing value at ${trail}`);
    return;
  }

  Object.keys(base).forEach((key) => {
    assert(candidate && Object.prototype.hasOwnProperty.call(candidate, key), `Missing key '${key}' at ${trail}`);
    compareShape(base[key], candidate[key], `${trail}.${key}`);
  });
}

const baseLocale = readLocale('en');
locales.forEach((locale) => {
  const candidate = readLocale(locale);
  compareShape(baseLocale, candidate, locale);
});

console.log('Locale sanity check passed: all locale files share the same shape and required keys.');
