import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON, contrast, validateTheme, validateIcons, validateContrast, validateNativeOnly, validateIndicators } from '../scripts/lib/validation.mjs';
const theme = readJSON('themes/obsidian-celluloid-light-color-theme.json');
const known = readJSON('tests/fixtures/vscode-color-ids.json').ids;
test('contrast calculation includes transparency', () => {
  assert.equal(contrast('#000000', '#FFFFFF'), 21);
  assert.equal(contrast('#00000000', '#FFFFFF'), 1);
  assert.ok(contrast('#00000080', '#FFFFFF') > 3.9);
});
test('invented color identifiers are rejected', () => {
  const broken = structuredClone(theme); broken.colors['secondarySidebar.background'] = '#FFFFFF';
  assert.throws(() => validateTheme(broken, known), /Theme validation/);
});
test('malformed semantic selectors are rejected', () => {
  const broken = structuredClone(theme); broken.semanticTokenColors['function.invented'] = '#0051CD';
  assert.throws(() => validateTheme(broken, known), /modifier/);
});
test('unreadable syntax is rejected', () => {
  const broken = structuredClone(theme); broken.tokenColors[0].settings.foreground = '#EEEEEE';
  assert.throws(() => validateContrast(broken), /Contrast/);
});
test('missing icon mappings are rejected', () => {
  const broken = readJSON('icons/obsidian-celluloid-icon-theme.json'); broken.fileExtensions.ts = 'missing';
  assert.throws(() => validateIcons(broken, 'icons'), /Broken icon mapping/);
});
test('custom UI contributions and sidebar visibility settings are rejected', () => {
  const manifest = readJSON('package.json');
  const preset = readJSON('presets/obsidian-celluloid.settings.json');
  validateNativeOnly(manifest, preset);
  const extraPanel = structuredClone(manifest);
  extraPanel.contributes.viewsContainers = { activitybar: [{ id: 'telemetry' }] };
  assert.throws(() => validateNativeOnly(extraPanel, preset), /native theme contributions/);
  assert.throws(() => validateNativeOnly(manifest, { ...preset, 'workbench.secondarySideBar.defaultVisibility': 'hidden' }), /sidebar visibility/);
});
test('semantic library objects retain neutral text while methods carry function color', () => {
  const tokens = readJSON('design/tokens.json');
  assert.equal(theme.semanticTokenColors['variable.defaultLibrary'], tokens.carbon);
  assert.equal(theme.semanticTokenColors.method, tokens.blue);
  assert.equal(theme.semanticTokenColors.function, tokens.blue);
  assert.equal(theme.semanticTokenColors.property, tokens.carbon);
  assert.equal(theme.semanticTokenColors['*.deprecated'].strikethrough, true);
});
test('keyboard focus indicators remain visible on selected rows', () => {
  validateIndicators(theme);
  const broken = structuredClone(theme);
  broken.colors['list.focusOutline'] = '#C0000720';
  assert.throws(() => validateIndicators(broken), /Indicator contrast/);
});
