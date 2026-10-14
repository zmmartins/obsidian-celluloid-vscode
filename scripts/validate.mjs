import fs from 'node:fs';
import { readJSON, validateTheme, validateIcons, validateContrast, validateNativeOnly, validateIndicators, validateIconContrast } from './lib/validation.mjs';

import { validateIconCoverage } from './lib/icon-coverage.mjs';
import { validateLightPreservation, validateColorThemePreservation } from './lib/preservation.mjs';

const manifest = readJSON('package.json');
if (manifest.main || manifest.browser || manifest.activationEvents || manifest.contributes.configurationDefaults)
  throw new Error('Theme must stay declarative and must not apply settings automatically');
if (manifest.name !== 'obsidian-celluloid' || !/^\d+\.\d+\.\d+$/.test(manifest.version) || !manifest.engines.vscode)
  throw new Error('Invalid extension manifest');
if (manifest.publisher !== undefined && !/^[a-z0-9][a-z0-9-]*$/i.test(manifest.publisher)) throw new Error('Invalid publisher ID');
if (manifest.categories[0] !== 'Themes' || manifest.contributes.themes.length !== 2 || manifest.contributes.iconThemes.length !== 1)
  throw new Error('Invalid theme contributions');
const known = readJSON('tests/fixtures/vscode-color-ids.json').ids;
const icons = readJSON(manifest.contributes.iconThemes[0].path);
validateIcons(icons, 'icons');
console.log(`${validateIconCoverage(icons)} major-file mapping checks passed for both variants.`);
fs.mkdirSync('dist', { recursive: true });
const expected = [
  ['Obsidian Celluloid (Light)', 'vs', 'light', 'presets/obsidian-celluloid.settings.json', ''],
  ['Obsidian Celluloid Noir', 'vs-dark', 'dark', 'presets/obsidian-celluloid-noir.settings.json', 'noir-']
];
for (const [index, [label, uiTheme, type, presetPath, prefix]] of expected.entries()) {
  const contribution = manifest.contributes.themes[index];
  if (contribution.label !== label || contribution.uiTheme !== uiTheme) throw new Error('Incorrect native theme contribution');
  const theme = readJSON(contribution.path);
  if (theme.name !== contribution.label) throw new Error('Theme label mismatch');
  validateTheme(theme, known, type);
  const results = validateContrast(theme);
  const indicators = validateIndicators(theme);
  const preset = readJSON(presetPath);
  validateNativeOnly(manifest, preset);
  if (preset['workbench.colorTheme'] !== label || preset['workbench.iconTheme'] !== manifest.contributes.iconThemes[0].id)
    throw new Error('Preset contribution mismatch');
  fs.writeFileSync(`dist/${prefix}contrast-report.json`, JSON.stringify(results, null, 2) + '\n');
  fs.writeFileSync(`dist/${prefix}indicator-contrast-report.json`, JSON.stringify(indicators, null, 2) + '\n');
  const iconResults = validateIconContrast(icons, 'icons', theme);
  fs.writeFileSync(`dist/${prefix}icon-contrast-report.json`, JSON.stringify(iconResults, null, 2) + '\n');
  console.log(`${iconResults.length} ${type} icon/background checks passed at 3:1 minimum.`);
  console.log(`${label}: ${Object.keys(theme.colors).length} documented IDs, ${results.length} text pairs (minimum ${Math.min(...results.map(r => r.ratio)).toFixed(2)}:1), ${indicators.length} indicators passed.`);
}
console.log(`${validateLightPreservation()} approved Light artifacts preserved byte for byte; original icon assets and unrelated associations preserved.`);
console.log(`${validateColorThemePreservation()} v0.3.0 theme/preset/Noir assets preserved byte for byte.`);
