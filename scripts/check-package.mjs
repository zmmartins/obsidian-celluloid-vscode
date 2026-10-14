import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { readJSON, validateIcons } from './lib/validation.mjs';
import { validateIconCoverage } from './lib/icon-coverage.mjs';
import { validateReleaseAppearance, validateReleaseAssets, validateMarkdownLinks, scanReleaseText } from './lib/release-validation.mjs';
const manifest = readJSON('package.json');
const vsix = path.resolve(process.argv[2] || (manifest.publisher ? `dist/obsidian-celluloid-${manifest.version}.vsix` : `dist/release-review/obsidian-celluloid-${manifest.version}-review.vsix`));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-vsix-check-'));
try {
  const result = spawnSync('unzip', ['-q', vsix, '-d', temp], { encoding: 'utf8' });
  if (result.status) throw new Error(result.stderr || 'unzip failed');
  const base = path.join(temp, 'extension');
  const packaged = readJSON(path.join(base, 'package.json'));
  for (const item of [...packaged.contributes.themes, ...packaged.contributes.iconThemes]) {
    if (!fs.existsSync(path.join(base, item.path))) throw new Error(`Packaged contribution missing: ${item.path}`);
  }
  validateIcons(readJSON(path.join(base, packaged.contributes.iconThemes[0].path)), path.join(base, 'icons'));
  // vsce normalizes the top-level README/changelog/license archive names.
  for (const name of ['readme.md', 'changelog.md', 'LICENSE.txt', 'presets/obsidian-celluloid.settings.json',
    'presets/obsidian-celluloid-noir.settings.json', 'presets/obsidian-celluloid-auto.settings.json',
    'docs/FILE-ICONS.md', 'docs/ASSET-PROVENANCE.md', 'docs/RELEASE.md',
    'assets/marketplace-icon.png', 'assets/screenshots/light.png', 'assets/screenshots/noir.png'])
    if (!fs.existsSync(path.join(base, name))) throw new Error(`Packaged deliverable missing: ${name}`);
  for (const forbidden of ['node_modules', 'references', 'reference', 'tests', 'scripts', '.vscode', 'dist', 'design', 'samples', '.aws', '.codex', '.agents'])
    if (fs.existsSync(path.join(base, forbidden))) throw new Error(`Unnecessary packaged directory: ${forbidden}`);
  validateIconCoverage(readJSON(path.join(base, packaged.contributes.iconThemes[0].path)));
  validateReleaseAppearance(base, { packaged: true });
  validateReleaseAssets(base);
  validateMarkdownLinks(base, true);
  const files = [];
  const walk = directory => {
    for (const item of fs.readdirSync(path.join(base, directory), { withFileTypes: true })) {
      const file = path.posix.join(directory, item.name);
      if (item.isDirectory()) walk(file); else files.push(file);
    }
  };
  walk('');
  scanReleaseText(base, files);
  if (fs.existsSync(path.join(base, 'assets/marketplace-icon.svg'))) throw new Error('Editable branding source should remain in GitHub, outside the VSIX');
  console.log('VSIX archive: all contributions, icons, presets and docs present; development dependencies and references excluded.');
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
