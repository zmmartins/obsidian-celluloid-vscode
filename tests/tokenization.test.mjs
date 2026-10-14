import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { Registry, parseRawGrammar } = require('vscode-textmate');
const onig = require('vscode-oniguruma');
const candidates = [process.env.VSCODE_EXTENSIONS_PATH,
  '/Applications/Visual Studio Code.app/Contents/Resources/app/extensions',
  '/usr/share/code/resources/app/extensions',
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs/Microsoft VS Code/resources/app/extensions')].filter(Boolean);
const extensions = candidates.find(p => fs.existsSync(path.join(p, 'typescript-basics/package.json')));
for (const variant of ['light', 'noir']) {
  const theme = JSON.parse(fs.readFileSync(`themes/obsidian-celluloid-${variant}-color-theme.json`, 'utf8'));
  const t = JSON.parse(fs.readFileSync(variant === 'light' ? 'design/tokens.json' : 'design/noir-tokens.json', 'utf8'));
  const number = variant === 'light' ? t.blue : t.amber;
  const primitive = variant === 'light' ? t.blue : t.amber;

  test(`${variant}: real VS Code grammars reproduce palette across ten language modes`, { skip: !extensions && 'Set VSCODE_EXTENSIONS_PATH to a VS Code built-in extensions directory' }, async tctx => {
    const grammarPaths = new Map();
    const injectionMap = new Map();
    for (const name of fs.readdirSync(extensions)) {
      const manifestPath = path.join(extensions, name, 'package.json');
      if (!fs.existsSync(manifestPath)) continue;
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      for (const grammar of manifest.contributes?.grammars || []) {
        grammarPaths.set(grammar.scopeName, path.join(extensions, name, grammar.path));
        for (const target of grammar.injectTo || []) injectionMap.set(target, [...(injectionMap.get(target) || []), grammar.scopeName]);
      }
    }
    const wasm = fs.readFileSync(require.resolve('vscode-oniguruma/release/onig.wasm'));
    await onig.loadWASM(wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength));
    const registry = new Registry({
      theme: { settings: [{ settings: { foreground: t.carbon, background: t.paper } }, ...theme.tokenColors] },
      onigLib: Promise.resolve({ createOnigScanner: patterns => new onig.OnigScanner(patterns), createOnigString: text => new onig.OnigString(text) }),
      loadGrammar: async scope => {
        const filename = grammarPaths.get(scope);
        return filename ? parseRawGrammar(fs.readFileSync(filename, 'utf8'), filename) : null;
      }, getInjections: scope => injectionMap.get(scope)
    });
    const fixtures = [
      ['source.ts', 'export function render(frame: number) { return true; } // studio', [['export', t.red], ['render', t.blue], ['number', primitive], ['true', t.green], ['// studio', t.comment]]],
      ['source.tsx', 'const Scene = () => <section title="35mm">Light</section>;', [['const', t.red], ['section', t.blue], ['35mm', t.amber]]],
      ['source.js', 'function render() { return "35mm"; } // studio', [['function', t.red], ['render', t.blue], ['return', t.red], ['35mm', t.amber], ['// studio', t.comment]]],
      ['source.js.jsx', 'const scene = <button disabled={true}>Render</button>;', [['const', t.red], ['button', t.blue], ['true', t.green]]],
      // VS Code's JSON grammar assigns the same scope to booleans and null.
      ['source.json', '{"stock": "5219", "active": true, "fps": 24, "missing": null}', [['stock', t.carbon], ['5219', t.amber], ['true', t.green], ['24', number], ['null', t.green]]],
      ['source.js', 'const viewport = window.matchMedia("screen"); console.log(viewport);', [['window', t.carbon], ['matchMedia', t.blue], ['console', t.carbon], ['log', t.blue], ['screen', t.amber]]],
      ['source.ts', 'function raster(frame: number) { return frame + 24; }', [['raster', t.blue], ['frame', t.carbon], ['number', primitive], ['return', t.red], ['24', number]]],
      ['source.python', 'def render(frame: int): return "35mm" # studio', [['def', t.red], ['render', t.blue], ['int', primitive], ['return', t.red], ['35mm', t.amber], ['# studio', t.comment]]],
      ['source.python', 'active = True; archived = False; grain = 0.042', [['True', t.green], ['False', t.green], ['0.042', number]]],
      ['text.html.basic', '<section title="35mm">&amp;</section>', [['section', t.blue], ['title', t.muted], ['35mm', t.amber], ['amp', t.red]]],
      ['source.css', '.scene { color: "red"; padding: 12px; }', [['scene', t.blue], ['color', t.muted], ['red', t.amber], ['12', number], ['px', t.amber]]],
      ['text.html.markdown', '# Studio light', [['Studio', t.red]]],
      ['text.html.markdown', 'A **bold** take with `35mm`.', [['bold', t.ink], ['35mm', t.amber]]],
      ['source.shell', 'echo "35mm" # studio', [['echo', t.blue], ['35mm', t.amber], ['# studio', t.comment]]]
    ];
    let checks = 0;
    for (const [scope, source, expectations] of fixtures) {
      await tctx.test(`${scope}: ${source}`, async () => {
        const grammar = await registry.loadGrammar(scope);
        assert.ok(grammar, `Missing built-in grammar ${scope}`);
        const { tokens } = grammar.tokenizeLine2(source, null);
        for (const [text, expected] of expectations) {
          const index = source.indexOf(text);
          assert.ok(index >= 0);
          let actual;
          for (let i = 0; i < tokens.length; i += 2) {
            if (tokens[i] <= index) actual = registry.getColorMap()[(tokens[i + 1] >>> 15) & 0x1ff];
          }
          const scopes = grammar.tokenizeLine(source, null).tokens.find(token => token.startIndex <= index && token.endIndex > index)?.scopes;
          assert.equal(actual?.toUpperCase(), expected, `${scope} ${text}; scopes=${scopes?.join(' ')}`);
          checks++;
        }
      });
    }
    // Exercise the full requested sample files, including embedded/fenced syntax.
    for (const [file, scope] of [['samples/SceneDirector.tsx', 'source.tsx'], ['samples/cinema.ts', 'source.ts'],
      ['samples/telemetry.py', 'source.python'], ['samples/telemetry.config.json', 'source.json'],
      ['samples/NOTES.md', 'text.html.markdown'], ['samples/index.html', 'text.html.basic'],
      ['samples/scene.css', 'source.css'], ['samples/terminal-colors.sh', 'source.shell']]) {
      const grammar = await registry.loadGrammar(scope);
      let state = null;
      for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
        const result = grammar.tokenizeLine2(line, state);
        assert.ok(result.tokens.length >= 2); state = result.ruleStack;
      }
    }
    console.log(`Verified ${checks} actual grammar token colors and eight complete sample files on ${os.platform()}.`);
    registry.dispose();
  });
}
