import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { readJSON } from './lib/validation.mjs';
if (process.platform !== 'darwin') throw new Error('The automatic native window capture currently supports macOS.');
const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-screenshots-'));
const workspace = path.join(temp, 'Obsidian Celluloid');
const phase = path.join(temp, 'phase.json');
let app;
const port = await new Promise(resolve => {
  const server = net.createServer();
  server.listen(0, '127.0.0.1', () => { const port = server.address().port; server.close(() => resolve(port)); });
});
const capture = async file => {
  const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = pages.find(page => page.type === 'page' && page.url.includes('workbench'));
  if (!page) throw new Error('Isolated native workbench target was not found');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  try {
    await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
    const captured = new Promise((resolve, reject) => {
      socket.addEventListener('message', event => {
        const result = JSON.parse(event.data);
        if (result.id === 1) result.error ? reject(new Error(result.error.message)) : resolve(result.result.data);
      });
    });
    socket.send(JSON.stringify({ id: 1, method: 'Page.captureScreenshot', params: { format: 'png', captureBeyondViewport: false, fromSurface: true } }));
    fs.writeFileSync(file, Buffer.from(await captured, 'base64'));
  } finally { socket.close(); }
};
try {
  fs.cpSync('samples', workspace, { recursive: true });
  for (const file of ['brief.pdf', 'budget.xlsx', 'bundle.zip', 'Dockerfile', 'metrics.csv', 'study.ipynb', 'score.wav', 'layout.fig']) {
    fs.writeFileSync(path.join(workspace, file), '');
  }
  const profile = path.join(temp, 'profile');
  fs.mkdirSync(path.join(profile, 'User'), { recursive: true });
  fs.writeFileSync(path.join(profile, 'User/settings.json'), JSON.stringify({
    ...readJSON('presets/obsidian-celluloid.settings.json'),
    'telemetry.telemetryLevel': 'off', 'update.mode': 'none',
    'security.workspace.trust.enabled': false, 'workbench.startupEditor': 'none'
  }));
  fs.mkdirSync('assets/screenshots', { recursive: true });
  const env = { ...process.env, OBSIDIAN_CAPTURE_PHASE: phase, OBSIDIAN_CAPTURE_WORKSPACE: workspace };
  delete env.ELECTRON_RUN_AS_NODE;
  const executable = process.env.VSCODE_EXECUTABLE || '/Applications/Visual Studio Code.app/Contents/MacOS/Code';
  app = spawn(executable, [`--remote-debugging-port=${port}`, '--new-window', '--disable-extensions', '--skip-welcome', '--skip-release-notes',
    '--user-data-dir', profile, '--extensions-dir', path.join(temp, 'extensions'),
    `--extensionDevelopmentPath=${root}`, `--extensionTestsPath=${root}/tests/screenshot-host.cjs`, workspace],
    { env, stdio: ['ignore', 'ignore', 'pipe'] });
  let errors = ''; app.stderr.on('data', data => { errors = (errors + data).slice(-4000); });
  const done = new Set();
  const records = [];
  const deadline = Date.now() + 90000;
  while (done.size < 2 && Date.now() < deadline && app.exitCode === null) {
    if (fs.existsSync(phase)) {
      const state = readJSON(phase);
      if (!done.has(state.variant)) {
        const file = `assets/screenshots/${state.variant}.png`;
        await capture(file);
        done.add(state.variant);
        records.push({ ...state, file });
        fs.writeFileSync(`${phase}.${state.variant}.done`, 'captured');
        console.log(`Captured real VS Code window: ${file}`);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (done.size !== 2) throw new Error(`Both native screenshots were not captured. ${errors}`);
  fs.mkdirSync('dist', { recursive: true });
  fs.writeFileSync('dist/screenshot-report.json', JSON.stringify({ status: 'passed', method: 'isolated native VS Code workbench capture via Chromium renderer', records }, null, 2) + '\n');
} finally {
  if (app && app.exitCode === null) {
    const exited = new Promise(resolve => app.once('exit', resolve));
    await Promise.race([exited, new Promise(resolve => setTimeout(resolve, 2500))]);
    if (app.exitCode === null) app.kill('SIGTERM');
  }
  fs.rmSync(temp, { recursive: true, force: true });
}
