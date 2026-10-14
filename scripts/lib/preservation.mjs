import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readJSON } from './validation.mjs';
import { defaultIconKeys, mappingIconKeys } from './icons.mjs';

// Captured from the approved v0.2.0 before the Noir implementation. Never
// regenerate this baseline during a build or test. Explicit v0.3.1 mapping
// refinements are reviewed separately; all other original associations stay fixed.
export function validateLightPreservation(base = '.') {
  const baseline = readJSON('tests/fixtures/light-v0.2-baseline.json');
  for (const [file, expected] of Object.entries(baseline.sha256)) {
    const actual = createHash('sha256').update(fs.readFileSync(path.join(base, file))).digest('hex');
    assert.equal(actual, expected, `Approved Light artifact changed: ${file}`);
  }
  const manifest = readJSON(path.join(base, 'package.json'));
  assert.deepEqual(manifest.contributes.themes[0], baseline.themeContribution);
  assert.deepEqual(manifest.contributes.iconThemes[0], baseline.iconContribution);
  const icons = readJSON(path.join(base, baseline.iconContribution.path));
  const refinements = readJSON('tests/fixtures/icon-refinements-v0.3.1.json');
  for (const [id, definition] of Object.entries(baseline.icons.iconDefinitions)) {
    assert.deepEqual(icons.iconDefinitions[id], definition, `Light icon definition changed: ${id}`);
  }
  for (const key of [...defaultIconKeys, ...mappingIconKeys]) {
    const actual = mappingIconKeys.includes(key) ? { ...icons[key], ...icons.light?.[key] } : icons.light?.[key] || icons[key];
    if (mappingIconKeys.includes(key)) {
      for (const [name, original] of Object.entries(baseline.icons[key])) {
        assert.equal(actual[name], refinements[key]?.[name] || original, `Unexpected Light icon association change: ${key}.${name}`);
      }
    } else assert.equal(actual, baseline.icons[key], `Effective Light default icon changed: ${key}`);
  }
  for (const key of ['$schema', 'hidesExplorerArrows', 'showLanguageModeIcons']) {
    assert.deepEqual(icons[key], baseline.icons[key], `Light icon behavior changed: ${key}`);
  }
  return Object.keys(baseline.sha256).length;
}

export function validateColorThemePreservation(base = '.') {
  const baseline = readJSON('tests/fixtures/color-themes-v0.3-baseline.json');
  for (const [file, expected] of Object.entries(baseline.sha256)) {
    assert.equal(createHash('sha256').update(fs.readFileSync(path.join(base, file))).digest('hex'), expected,
      `Existing color theme, preset or Noir asset changed: ${file}`);
  }
  return Object.keys(baseline.sha256).length;
}
