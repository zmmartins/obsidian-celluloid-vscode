import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON, contrast, validateTheme, validateContrast, validateIndicators, validateIcons, validateIconContrast } from '../scripts/lib/validation.mjs';
import { validateLightPreservation } from '../scripts/lib/preservation.mjs';
import { defaultIconKeys, mappingIconKeys } from '../scripts/lib/icons.mjs';
import { releaseIdentity } from '../scripts/lib/release-identity.mjs';

const manifest = readJSON('package.json');
const noir = readJSON('themes/obsidian-celluloid-noir-color-theme.json');
const t = readJSON('design/noir-tokens.json');
const icons = readJSON('icons/obsidian-celluloid-icon-theme.json');
const known = readJSON('tests/fixtures/vscode-color-ids.json').ids;

test('approved Light artifacts and unrelated icon associations remain unchanged', () => {
  assert.equal(validateLightPreservation(), 34);
});
test('two independent native themes coexist under the original extension identity', () => {
  releaseIdentity(manifest);
  assert.deepEqual(manifest.contributes.themes.map(({ label, uiTheme }) => ({ label, uiTheme })), [
    { label: 'Obsidian Celluloid (Light)', uiTheme: 'vs' },
    { label: 'Obsidian Celluloid Noir', uiTheme: 'vs-dark' }
  ]);
  validateTheme(noir, known, 'dark');
  assert.throws(() => validateTheme(noir, known, 'light'), /Theme validation/);
});
test('Noir covers shared workbench categories with intentional dark surfaces and accents', () => {
  const light = readJSON(manifest.contributes.themes[0].path);
  assert.deepEqual(Object.keys(noir.colors), Object.keys(light.colors));
  for (const id of ['editor.background', 'terminal.background', 'editorGutter.background']) assert.equal(noir.colors[id], '#0A0A0C');
  for (const id of ['sideBar.background', 'activityBar.background', 'statusBar.background']) assert.equal(noir.colors[id], '#121216');
  assert.equal(noir.colors['editorHoverWidget.background'], '#18181D');
  assert.equal(noir.colors['list.activeSelectionBackground'], '#202026');
  assert.equal(noir.colors['tab.activeBorderTop'], t.red);
  assert.equal(noir.colors['tab.activeBorder'], '#00000000');
  assert.equal(noir.colors['editorCursor.foreground'], t.blue);
  assert.equal(noir.colors['terminalCursor.foreground'], t.red);
});
test('Noir text and focus contrast pass and reject unreadable dark values', () => {
  assert.equal(validateContrast(noir).length, 269);
  assert.equal(validateIndicators(noir).length, 8);
  const broken = structuredClone(noir);
  broken.tokenColors[0].settings.foreground = '#202026';
  assert.throws(() => validateContrast(broken), /Contrast/);
  broken.colors['list.focusOutline'] = t.red + '20';
  assert.throws(() => validateIndicators(broken), /Indicator contrast/);
});
test('Noir semantic rules agree with dark TextMate numbers, primitives and symbol categories', () => {
  const s = noir.semanticTokenColors;
  assert.equal(s.number, t.amber);
  assert.equal(s['type.defaultLibrary'], t.amber);
  assert.equal(s.keyword, t.red);
  assert.equal(s.string, t.amber);
  assert.equal(s.method, t.blue);
  assert.equal(s.function, t.blue);
  for (const key of ['variable', 'parameter', 'property', 'variable.defaultLibrary']) assert.equal(s[key], t.ink);
  assert.equal(s.comment.foreground, t.comment);
  assert.equal(s['*.deprecated'].strikethrough, true);
  for (const name of ['Cobalt numbers', 'Primitive types']) assert.equal(noir.tokenColors.find(rule => rule.name === name).settings.foreground, s.number);
});
test('all sixteen ANSI foregrounds are readable and bright variants remain distinct', () => {
  const entries = Object.entries(noir.colors).filter(([id]) => id.startsWith('terminal.ansi'));
  assert.equal(entries.length, 16);
  for (const [id, fg] of entries) assert.ok(contrast(fg, noir.colors['terminal.background']) >= 4.5, id);
  for (const name of ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White']) {
    assert.notEqual(noir.colors[`terminal.ansi${name}`], noir.colors[`terminal.ansiBright${name}`]);
  }
});
test('Noir gutter and minimap retain visible text, syntax density and graded red viewport', () => {
  assert.ok(contrast(noir.colors['editorLineNumber.foreground'], noir.colors['editorGutter.background']) >= 4.5);
  assert.ok(contrast(noir.colors['editorLineNumber.activeForeground'], noir.colors['editorGutter.background']) > 15);
  const alpha = id => parseInt(noir.colors[id].slice(7), 16) / 255;
  assert.ok(alpha('minimap.foregroundOpacity') >= .6);
  const sliders = ['minimapSlider.background', 'minimapSlider.hoverBackground', 'minimapSlider.activeBackground'];
  sliders.forEach(id => assert.equal(noir.colors[id].slice(0, 7), t.red));
  assert.ok(alpha(sliders[0]) >= .1 && alpha(sliders[0]) < alpha(sliders[1]) && alpha(sliders[1]) < alpha(sliders[2]));
  assert.notEqual(noir.colors['editorIndentGuide.background1'], '#00000000');
});
test('shared icon variants are readable and change only the ink of failing glyphs', () => {
  validateIcons(icons, 'icons');
  assert.equal(validateIconContrast(icons, 'icons', noir).length, 225);
  const originals = readJSON('tests/fixtures/light-v0.2-baseline.json').icons;
  const backgrounds = ['sideBar.background', 'list.hoverBackground', 'list.activeSelectionBackground', 'tab.activeBackground', 'tab.inactiveBackground'];
  for (const [id, definition] of Object.entries(originals.iconDefinitions)) {
    const original = fs.readFileSync(path.join('icons', definition.iconPath), 'utf8');
    const ink = original.match(/color="(#[\da-f]{6})"/i)[1];
    const replacement = icons.iconDefinitions[`${id}-noir`];
    const needsVariant = backgrounds.some(bg => contrast(ink, noir.colors[bg]) < 3);
    assert.equal(Boolean(replacement), needsVariant, `Only replace insufficient contrast: ${id}`);
    if (replacement) {
      const dark = fs.readFileSync(path.join('icons', replacement.iconPath), 'utf8');
      assert.equal(dark.replace(/color="#[\da-f]{6}"/i, 'color="INK"'), original.replace(/color="#[\da-f]{6}"/i, 'color="INK"'));
    }
  }
  for (const key of defaultIconKeys) assert.equal(icons[key].replace(/-noir$/, ''), originals[key]);
  const refinements = readJSON('tests/fixtures/icon-refinements-v0.3.1.json');
  for (const key of mappingIconKeys) {
    for (const [name, original] of Object.entries(originals[key])) {
      assert.equal(icons[key][name].replace(/-noir$/, ''), refinements[key]?.[name] || original);
    }
  }
  const broken = structuredClone(icons); broken.light.fileExtensions.ts = 'missing';
  assert.throws(() => validateIcons(broken, 'icons'), /Broken icon mapping/);
});
test('optional Noir preset reuses all Light typography/layout values and automatic switching stays opt-in', () => {
  const light = readJSON('presets/obsidian-celluloid.settings.json');
  const dark = readJSON('presets/obsidian-celluloid-noir.settings.json');
  assert.deepEqual(dark, { ...light, 'workbench.colorTheme': noir.name });
  assert.deepEqual(readJSON('presets/obsidian-celluloid-auto.settings.json'), {
    'window.autoDetectColorScheme': true,
    'workbench.preferredLightColorTheme': light['workbench.colorTheme'],
    'workbench.preferredDarkColorTheme': noir.name
  });
  assert.equal(manifest.contributes.configurationDefaults, undefined);
  assert.equal(manifest.main, undefined);
  assert.equal(manifest.browser, undefined);
});
