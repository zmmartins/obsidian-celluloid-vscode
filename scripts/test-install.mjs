import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readJSON, validateIcons, validateTheme, validateIconContrast } from './lib/validation.mjs';
import { validateIconCoverage } from './lib/icon-coverage.mjs';
import { validateReleaseAppearance } from './lib/release-validation.mjs';
const manifest = readJSON('package.json');
if (!manifest.publisher) throw new Error('Supply the real publisher and repository metadata before testing installation of the final release VSIX.');
const vsix = path.resolve(`dist/obsidian-celluloid-${manifest.version}.vsix`);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-install-'));
const extensions = path.join(temp, 'extensions');
const args = ['--user-data-dir', path.join(temp, 'profile'), '--extensions-dir', extensions];
try {
  const run = extra => {
    const result = spawnSync(process.env.VSCODE_CLI || 'code', [...args, ...extra], { encoding: 'utf8', timeout: 60000 });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(result.stderr || result.stdout || `CLI exit ${result.status}`);
    return result.stdout;
  };
  console.log(run(['--install-extension', vsix]));
  const installed = run(['--list-extensions', '--show-versions']);
  const id = `${manifest.publisher}.${manifest.name}@${manifest.version}`;
  if (!installed.split(/\r?\n/).includes(id)) throw new Error(`Installed extension missing: ${installed}`);
  const installedRoot = path.join(extensions, `${manifest.publisher}.${manifest.name}-${manifest.version}`);
  const installedManifest = readJSON(path.join(installedRoot, 'package.json'));
  const icons = readJSON(path.join(installedRoot, installedManifest.contributes.iconThemes[0].path));
  const iconBase = path.join(installedRoot, 'icons');
  validateIcons(icons, iconBase);
  const known = readJSON('tests/fixtures/vscode-color-ids.json').ids;
  for (const contribution of installedManifest.contributes.themes) {
    const theme = readJSON(path.join(installedRoot, contribution.path));
    validateTheme(theme, known, contribution.uiTheme === 'vs' ? 'light' : 'dark');
    validateIconContrast(icons, iconBase, theme);
  }
  const coverageChecks = validateIconCoverage(icons);
  const preservedAppearanceArtifacts = validateReleaseAppearance(installedRoot, { packaged: true });
  const result = { extension: id, platform: process.platform, profile: 'temporary', coverageChecks, preservedAppearanceArtifacts,
    themes: installedManifest.contributes.themes.map(theme => theme.label),
    vsixSha256: createHash('sha256').update(fs.readFileSync(vsix)).digest('hex'), status: 'passed' };
  fs.writeFileSync('dist/install-report.json', JSON.stringify(result, null, 2) + '\n');
  console.log('Isolated VSIX installation and installed assets passed.');
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
