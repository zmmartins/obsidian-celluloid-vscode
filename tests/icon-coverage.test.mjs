import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON, validateIconContrast } from '../scripts/lib/validation.mjs';
import { resolveFileIcon, validateIconCoverage } from '../scripts/lib/icon-coverage.mjs';
import { validateColorThemePreservation } from '../scripts/lib/preservation.mjs';

const icons = readJSON('icons/obsidian-celluloid-icon-theme.json');
const coverage = readJSON('tests/fixtures/icon-coverage.json');
const variants = ['light', 'dark'];

test('all 94 representative major files have exact family mappings in both variants', () => {
  assert.equal(Object.values(coverage).flat().length, 94);
  assert.equal(validateIconCoverage(icons), 188);
  for (const type of variants) {
    const fallback = type === 'light' ? icons.light.file : icons.file;
    for (const files of Object.values(coverage)) {
      for (const file of files) assert.notEqual(resolveFileIcon(icons, file, type), fallback, `${type}: ${file}`);
    }
  }
});
test('a valid but generic mapping is rejected instead of passing coverage silently', () => {
  for (const ext of ['pdf', 'zip', 'csv', 'yaml', 'toml', 'sql', 'ipynb']) {
    const broken = structuredClone(icons);
    broken.fileExtensions[ext] = broken.file;
    broken.light.fileExtensions[ext] = broken.light.file;
    assert.throws(() => validateIconCoverage(broken), /Icon coverage/);
  }
});
test('native filename and compound-extension precedence protects tooling and test files', () => {
  for (const type of variants) {
    for (const [file, expected] of [
      ['PACKAGE.JSON', 'package'], ['pnpm-lock.yaml', 'lock'], ['pom.xml', 'build'],
      ['BUILD.GRADLE.KTS', 'build'], ['archive.TAR.GZ', 'archive'],
      ['scene.test.tsx', 'test'], ['scene.spec.js', 'test'], ['Dockerfile', 'docker'],
      ['.env', 'config'], ['.env.local', 'config'], ['.gitignore', 'git']
    ]) assert.equal(resolveFileIcon(icons, file, type).replace(/-noir$/, ''), expected);
    assert.equal(resolveFileIcon(icons, 'unrecognized-extension', type, 'dockerfile').replace(/-noir$/, ''), 'docker');
    assert.equal(resolveFileIcon(icons, 'unknown.language', type, 'sql').replace(/-noir$/, ''), 'database');
    assert.equal(resolveFileIcon(icons, 'plain.txt', type, 'sql').replace(/-noir$/, ''), 'document');
  }
});
test('unrecognized and extensionless files intentionally retain the generic fallback', () => {
  for (const type of variants) {
    for (const file of ['opaque.unknown-format', 'unrecognized-extension', '.unrecognized-dotfile']) {
      assert.equal(resolveFileIcon(icons, file, type), type === 'light' ? icons.light.file : icons.file);
    }
  }
});
test('all 45 glyphs pass contrast on the actual Light and Noir icon surfaces', () => {
  for (const variant of ['light', 'noir']) {
    const theme = readJSON(`themes/obsidian-celluloid-${variant}-color-theme.json`);
    assert.equal(validateIconContrast(icons, 'icons', theme).length, 225);
    const broken = structuredClone(theme);
    broken.colors['sideBar.background'] = '#8E4E00';
    assert.throws(() => validateIconContrast(icons, 'icons', broken), /Icon contrast/);
  }
});
test('new glyphs preserve the mechanical stroke and dark variants change only ink', () => {
  const oldIds = new Set(Object.keys(readJSON('tests/fixtures/light-v0.2-baseline.json').icons.iconDefinitions));
  const additions = Object.keys(icons.iconDefinitions).filter(id => !oldIds.has(id) && !id.endsWith('-noir'));
  assert.equal(additions.length, 17);
  for (const id of additions) {
    const source = fs.readFileSync(path.join('icons', icons.iconDefinitions[id].iconPath), 'utf8');
    for (const attribute of ['viewBox="0 0 16 16"', 'stroke-width="1.1"', 'stroke-linecap="round"', 'stroke-linejoin="round"']) {
      assert.ok(source.includes(attribute), `${id}: ${attribute}`);
    }
    const darkDefinition = icons.iconDefinitions[`${id}-noir`];
    if (darkDefinition) {
      const dark = fs.readFileSync(path.join('icons', darkDefinition.iconPath), 'utf8');
      assert.equal(dark.replace(/color="#[\da-f]{6}"/i, 'color="INK"'), source.replace(/color="#[\da-f]{6}"/i, 'color="INK"'));
    }
  }
});
test('both color themes, palettes, presets and existing Noir assets remain byte-identical', () => {
  assert.equal(validateColorThemePreservation(), 33);
});
