import assert from 'node:assert/strict';
import path from 'node:path';
import { readJSON } from './validation.mjs';

// Exercise native filename > longest compound extension > language > default
// precedence. Production associations remain plain native icon-theme JSON.
export function resolveFileIcon(icons, file, type, languageId) {
  const overrides = type === 'light' ? icons.light || {} : {};
  const names = { ...icons.fileNames, ...overrides.fileNames };
  const extensions = { ...icons.fileExtensions, ...overrides.fileExtensions };
  const languages = { ...icons.languageIds, ...overrides.languageIds };
  const name = path.basename(file).toLowerCase();
  if (names[name]) return names[name];
  const suffix = Object.keys(extensions).filter(ext => name.endsWith(`.${ext}`)).sort((a, b) => b.length - a.length)[0];
  return suffix ? extensions[suffix] : languages[languageId] || overrides.file || icons.file;
}

export function validateIconCoverage(icons) {
  const coverage = readJSON('tests/fixtures/icon-coverage.json');
  let checks = 0;
  for (const type of ['light', 'dark']) {
    for (const [expected, files] of Object.entries(coverage)) {
      for (const file of files) {
        const actual = resolveFileIcon(icons, file, type);
        assert.equal(actual.replace(/-noir$/, ''), expected, `Icon coverage ${type}: ${file}`);
        assert.ok(icons.iconDefinitions[actual], `Missing covered icon definition: ${actual}`);
        checks++;
      }
    }
  }
  return checks;
}
