// Real native UI only, exercised in the disposable screenshot profile.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vscode = require('vscode');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
exports.run = async () => {
  assert.ok(process.env.OBSIDIAN_CAPTURE_PHASE && process.env.OBSIDIAN_CAPTURE_WORKSPACE);
  const config = vscode.workspace.getConfiguration();
  await config.update('workbench.colorTheme', 'Obsidian Celluloid Noir', vscode.ConfigurationTarget.Global);
  await pause(800);
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  const workspace = process.env.OBSIDIAN_CAPTURE_WORKSPACE;
  for (const file of ['telemetry.py', 'telemetry.config.json', 'cinema.ts']) {
    const doc = await vscode.workspace.openTextDocument(path.join(workspace, file));
    await vscode.window.showTextDocument(doc, { preview: false });
  }
  await vscode.commands.executeCommand('workbench.view.explorer');
  await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(path.join(workspace, 'cinema.ts')));
  const commands = await vscode.commands.getCommands(true);
  // Compose the disposable preview using ordinary native view commands only.
  for (const command of ['workbench.action.closeAuxiliaryBar', 'notifications.clearAll', 'notifications.hideToasts']) {
    if (commands.includes(command)) await vscode.commands.executeCommand(command);
  }
  const terminal = vscode.window.createTerminal({ name: 'Celluloid', cwd: workspace,
    shellPath: '/bin/sh', shellArgs: ['-c', "printf 'Obsidian Celluloid — native syntax samples\\n\\n'; python3 telemetry.py; printf '\\n\\033[31mVermilion\\033[0m  \\033[34mCobalt\\033[0m  \\033[33mAmber\\033[0m  \\033[32mEmerald\\033[0m\\n\\ncelluloid $ '; sleep 300"] });
  terminal.show(true);
  for (const [variant, label, kind] of [
    ['light', 'Obsidian Celluloid (Light)', vscode.ColorThemeKind.Light],
    ['noir', 'Obsidian Celluloid Noir', vscode.ColorThemeKind.Dark]
  ]) {
    await config.update('workbench.colorTheme', label, vscode.ConfigurationTarget.Global);
    const deadline = Date.now() + 10000;
    while (vscode.window.activeColorTheme.kind !== kind && Date.now() < deadline) await pause(100);
    assert.equal(vscode.window.activeColorTheme.kind, kind);
    if (commands.includes('notifications.clearAll')) await vscode.commands.executeCommand('notifications.clearAll');
    await vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
    await pause(2200);
    fs.writeFileSync(process.env.OBSIDIAN_CAPTURE_PHASE, JSON.stringify({ variant, vscode: vscode.version, theme: label }));
    const ack = `${process.env.OBSIDIAN_CAPTURE_PHASE}.${variant}.done`;
    const captureDeadline = Date.now() + 45000;
    while (!fs.existsSync(ack) && Date.now() < captureDeadline) await pause(200);
    assert.ok(fs.existsSync(ack), `Native ${variant} screenshot was captured`);
  }
  terminal.dispose();
};
