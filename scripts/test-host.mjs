import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-host-'));
fs.mkdirSync(path.join(temp, 'profile/User'), { recursive: true });
fs.copyFileSync('presets/obsidian-celluloid.settings.json', path.join(temp, 'profile/User/settings.json'));
const settingsSchemaFile = path.join(temp, 'schema/.vscode/settings.json');
fs.mkdirSync(path.dirname(settingsSchemaFile), { recursive: true });
fs.copyFileSync('presets/obsidian-celluloid.settings.json', settingsSchemaFile);
const extraSchemaFiles = ['noir', 'auto'].map(variant => {
  const target = path.join(temp, `schema-${variant}/.vscode/settings.json`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(`presets/obsidian-celluloid-${variant}.settings.json`, target);
  return target;
});
fs.mkdirSync('dist', { recursive: true });
const report = path.join(root, 'dist/host-report.json');
fs.rmSync(report, { force: true });
const hostEnv = { ...process.env, OBSIDIAN_HOST_REPORT: report, OBSIDIAN_EXTENSION_ROOT: root, OBSIDIAN_PRESET_SCHEMA_FILE: settingsSchemaFile,
  OBSIDIAN_ADDITIONAL_SCHEMA_FILES: JSON.stringify(extraSchemaFiles), OBSIDIAN_ISOLATED_PROFILE: path.join(temp, 'profile') };
delete hostEnv.ELECTRON_RUN_AS_NODE;
try {
  const executable = process.env.VSCODE_EXECUTABLE || (process.platform === 'darwin' ? '/Applications/Visual Studio Code.app/Contents/MacOS/Code' : '/usr/share/code/code');
  const result = spawnSync(executable, ['--new-window', '--disable-extensions', '--skip-welcome', '--skip-release-notes',
    '--user-data-dir', path.join(temp, 'profile'), '--extensions-dir', path.join(temp, 'extensions'),
    `--extensionDevelopmentPath=${root}`, `--extensionTestsPath=${root}/tests/host.cjs`, path.join(root, 'samples')],
    { stdio: 'inherit', timeout: 90000, env: hostEnv });
  if (result.error) throw result.error;
  if (result.status !== 0 || !fs.existsSync(report)) throw new Error(`Host validation did not complete (exit ${result.status}); no passing report`);
  console.log(fs.readFileSync(report, 'utf8'));
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
