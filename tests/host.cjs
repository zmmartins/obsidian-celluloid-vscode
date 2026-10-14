// Runs only inside an isolated VS Code Extension Development Host.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vscode = require('vscode');
const waitForTheme = async (kind, name) => {
  const deadline = Date.now() + 10000;
  while ((vscode.window.activeColorTheme.kind !== kind || vscode.workspace.getConfiguration().get('workbench.colorTheme') !== name) && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.equal(vscode.window.activeColorTheme.kind, kind, 'Native theme finished loading');
  assert.equal(vscode.workspace.getConfiguration().get('workbench.colorTheme'), name, 'Native configuration finished updating');
};
exports.run = async () => {
  const extension = vscode.extensions.all.find(item => item.packageJSON.name === 'obsidian-celluloid' && item.extensionPath === process.env.OBSIDIAN_EXTENSION_ROOT);
  assert.ok(extension, 'Extension is discoverable by VS Code');
  assert.equal(extension.packageJSON.contributes.themes[0].uiTheme, 'vs');
  assert.equal(extension.packageJSON.contributes.themes[1].uiTheme, 'vs-dark');
  const root = extension.extensionPath;
  const preset = JSON.parse(fs.readFileSync(path.join(root, 'presets/obsidian-celluloid.settings.json'), 'utf8'));
  const config = vscode.workspace.getConfiguration();
  // Development hosts initially preview the contributed theme matching their
  // startup scheme. Normalize selection explicitly inside the disposable profile.
  assert.ok(process.env.OBSIDIAN_ISOLATED_PROFILE, 'Theme switching requires the isolated test runner');
  assert.ok(fs.existsSync(path.join(process.env.OBSIDIAN_ISOLATED_PROFILE, 'User/settings.json')));
  const switchTheme = async (name, kind) => {
    await config.update('workbench.colorTheme', name, vscode.ConfigurationTarget.Global);
    await waitForTheme(kind, name);
    assert.equal(vscode.workspace.getConfiguration().get('workbench.iconTheme'), 'obsidian-celluloid-icons');
  };
  await switchTheme('Obsidian Celluloid Noir', vscode.ColorThemeKind.Dark);
  await switchTheme('Obsidian Celluloid (Light)', vscode.ColorThemeKind.Light);
  for (const [key, expected] of Object.entries(preset)) {
    assert.ok(config.inspect(key)?.defaultValue !== undefined, `Setting is registered: ${key}`);
    assert.deepEqual(config.get(key), expected, `Preset applied in isolated profile: ${key}`);
  }
  const optionalPresets = ['presets/obsidian-celluloid-noir.settings.json', 'presets/obsidian-celluloid-auto.settings.json'];
  let optionalSettingsChecked = 0;
  for (const file of optionalPresets) {
    for (const key of Object.keys(JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')))) {
      assert.ok(config.inspect(key)?.defaultValue !== undefined, `Optional setting is registered: ${key}`);
      optionalSettingsChecked++;
    }
  }
  await vscode.extensions.getExtension('vscode.json-language-features').activate();
  const files = ['package.json', 'themes/obsidian-celluloid-light-color-theme.json',
    'themes/obsidian-celluloid-noir-color-theme.json', 'icons/obsidian-celluloid-icon-theme.json'];
  const documents = [];
  const extraSchemaFiles = JSON.parse(process.env.OBSIDIAN_ADDITIONAL_SCHEMA_FILES || '[]');
  for (const file of [...files, process.env.OBSIDIAN_PRESET_SCHEMA_FILE, ...extraSchemaFiles].filter(Boolean)) {
    const document = await vscode.workspace.openTextDocument(path.resolve(root, file));
    await vscode.window.showTextDocument(document);
    documents.push(document);
  }
  await new Promise(resolve => setTimeout(resolve, 4000));
  for (const document of documents) {
    const diagnostics = vscode.languages.getDiagnostics(document.uri).filter(d => d.severity === vscode.DiagnosticSeverity.Error || d.severity === vscode.DiagnosticSeverity.Warning);
    assert.deepEqual(diagnostics.map(d => d.message), [], `Native JSON schema diagnostics: ${document.fileName}`);
  }
  for (const [file, language] of [['SceneDirector.tsx', 'typescriptreact'], ['cinema.ts', 'typescript'],
    ['telemetry.py', 'python'], ['telemetry.config.json', 'json'], ['NOTES.md', 'markdown'],
    ['index.html', 'html'], ['scene.css', 'css'], ['terminal-colors.sh', 'shellscript']]) {
    const doc = await vscode.workspace.openTextDocument(path.join(root, 'samples', file));
    assert.equal(doc.languageId, language);
  }
  await switchTheme('Obsidian Celluloid Noir', vscode.ColorThemeKind.Dark);
  await vscode.window.showTextDocument(await vscode.workspace.openTextDocument(path.join(root, 'samples/SceneDirector.tsx')));
  await switchTheme('Obsidian Celluloid (Light)', vscode.ColorThemeKind.Light);
  for (const [key, expected] of Object.entries(preset)) assert.deepEqual(vscode.workspace.getConfiguration().get(key), expected, `Light restored: ${key}`);
  const result = { vscode: vscode.version, platform: process.platform,
    extension: extension.id, version: extension.packageJSON.version, theme: vscode.workspace.getConfiguration().get('workbench.colorTheme'),
    settingsChecked: Object.keys(preset).length, schemaFilesChecked: documents.length,
    themesChecked: ['Obsidian Celluloid (Light)', 'Obsidian Celluloid Noir'],
    themeSwitching: 'Light -> Noir -> Light', optionalSettingsChecked,
    status: 'passed' };
  fs.writeFileSync(process.env.OBSIDIAN_HOST_REPORT || path.join(root, 'dist/host-report.json'), JSON.stringify(result, null, 2) + '\n');
  console.log('Obsidian Celluloid native host validation passed:', result);
};
