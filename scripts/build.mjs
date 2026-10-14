import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTheme } from './lib/theme.mjs';
import { noirOptions } from './lib/noir.mjs';
import { adaptIcons } from './lib/icons.mjs';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const t = JSON.parse(fs.readFileSync('design/tokens.json', 'utf8'));

const write = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');
};
const light = createTheme(t, { name: 'Obsidian Celluloid (Light)', type: 'light' });
const noirTokens = JSON.parse(fs.readFileSync('design/noir-tokens.json', 'utf8'));
const noir = createTheme(noirTokens, noirOptions(noirTokens));
write('themes/obsidian-celluloid-light-color-theme.json', light);
write('themes/obsidian-celluloid-noir-color-theme.json', noir);

// Original 16px mechanical glyphs. No external artwork, text glyphs, fonts or scripts.
const glyphs = {
  file: ['icon', '<path d="M4 2.5h5l3 3v8H4zM9 2.5v3h3M6 8h4M6 10.5h3"/>'],
  folder: ['icon', '<path d="M2.5 4.5h4L8 6h5.5v6.5h-11z"/>'],
  'folder-open': ['icon', '<path d="M2.5 11.5v-7h4L8 6h5.5v2M2.5 12.5L4 8h10l-1.5 4.5z"/>'],
  'folder-src': ['blue', '<path d="M2 4h5l1.5 2H14v7H2zM6 8l-1.5 1.5L6 11M10 8l1.5 1.5L10 11"/>'],
  'folder-src-open': ['blue', '<path d="M2 12V4h5l1.5 2H14v2M2 13l2-5h10l-2 5z"/><circle cx="8" cy="10.5" r=".6" fill="currentColor"/>'],
  'folder-config': ['amber', '<path d="M2 4h5l1.5 2H14v7H2zM5 9h6M7 8v2M9 10v2"/>'],
  'folder-config-open': ['amber', '<path d="M2 12V4h5l1.5 2H14v2M2 13l2-5h10l-2 5zM6 10.5h4"/>'],
  'folder-test': ['green', '<path d="M2 4h5l1.5 2H14v7H2zM5.5 9.5l1.5 1.5 3-3"/>'],
  'folder-test-open': ['green', '<path d="M2 12V4h5l1.5 2H14v2M2 13l2-5h10l-2 5zM6 10l1 1 2-2"/>'],
  typescript: ['blue', '<path d="M2.5 3h11v10h-11zM4.5 6h4M6.5 6v5M11.5 6h-2v2.5h2V11h-2"/>'],
  javascript: ['amber', '<path d="M2.5 3h11v10h-11zM6.5 6v5h-2V9.5M11.5 6h-2v2.5h2V11h-2"/>'],
  react: ['blue', '<path d="M5.5 3H3v10h2.5M10.5 3H13v10h-2.5M8 5.5l2.5 2.5L8 10.5 5.5 8z"/><circle cx="8" cy="8" r=".5" fill="currentColor"/>'],
  python: ['amber', '<path d="M4 7V3.5h6V8H3v4.5h6V9M6 3.5v1M11 4h2v8h-2M7 11v1"/>'],
  json: ['amber', '<path d="M5 2.5H3.5V6L2 8l1.5 2v3.5H5M11 2.5h1.5V6L14 8l-1.5 2v3.5H11"/><circle cx="8" cy="6" r=".65" fill="currentColor"/><circle cx="8" cy="10" r=".65" fill="currentColor"/>'],
  html: ['red', '<path d="M5.5 4L2 8l3.5 4M10.5 4L14 8l-3.5 4M9 3l-2 10"/>'],
  css: ['blue', '<path d="M6 2L4 14M12 2l-2 12M2.5 6h11M2 10h11"/>'],
  markdown: ['secondary', '<path d="M2 4h12v8H2zM4 10V6l2 2 2-2v4M11 6v4M9.5 8.5L11 10l1.5-1.5"/>'],
  shell: ['red', '<path d="M2 3h12v10H2zM4 6l2 2-2 2M8 10h3"/>'],
  config: ['secondary', '<path d="M3 4h10M3 8h10M3 12h10M6 2.5v3M10 6.5v3M5 10.5v3"/>'],
  git: ['red', '<path d="M8 1.5L14.5 8 8 14.5 1.5 8zM5 5l5 5M8 8v3"/><circle cx="5" cy="5" r="1"/><circle cx="10" cy="10" r="1"/>'],
  package: ['amber', '<path d="M8 2l6 3v7l-6 3-6-3V5zM2 5l6 3 6-3M8 8v7M5 3.5l6 3V9"/>'],
  lock: ['amber', '<path d="M3.5 7h9v7h-9zM5 7V4a3 3 0 016 0v3M8 10v1.5"/>'],
  test: ['green', '<path d="M6 2h4M7 2v4l-4 7h10L9 6V2M5 10h6"/>'],
  image: ['purple', '<path d="M2 2.5h12v11H2zM2 11l4-4 3 3 2-2 3 3"/><circle cx="10.5" cy="5" r="1"/>'],
  shader: ['blue', '<path d="M8 1.5L14 5v7l-6 3-6-3V5zM2 5l6 3 6-3M8 8v7M5 6.5l6 6M11 6.5l-6 6"/>'],
  document: ['secondary', '<path d="M3 2h10v12H3zM5 5h6M5 8h6M5 11h4"/>'],
  film: ['red', '<path d="M2 2h12v12H2zM5 2v12M11 2v12M2 5h3M2 8h3M2 11h3M11 5h3M11 8h3M11 11h3"/>'],
  code: ['blue', '<path d="M5 4L1.5 8 5 12M11 4l3.5 4-3.5 4M9 2L7 14"/>'],
  // Document/office family: fixed-layout page, bound prose, slide and worksheet.
  pdf: ['red', '<path d="M3 2h7l3 3v9H3zM10 2v3h3M5 11c0-5 3-5 3-2s-3 3-3 1c0-1 3-1 5 1"/>'],
  office: ['blue', '<path d="M3 2h10v12H3zM5 2v12M7 5h4M7 8h4M7 11h3"/>'],
  presentation: ['amber', '<path d="M2 3h12v8H2zM8 11v3M5 14h6M10 5v4h2"/><circle cx="5.5" cy="7" r="1.5"/>'],
  spreadsheet: ['green', '<path d="M2 2.5h12v11H2zM2 6h12M2 9.5h12M6 2.5v11M10 6v7.5"/>'],
  // Structured data: rows, indented branches and markup delimiters.
  data: ['blue', '<path d="M2 3h12v10H2zM6 3v10M8 6h4M8 10h4"/><circle cx="4" cy="6" r=".5" fill="currentColor"/><circle cx="4" cy="10" r=".5" fill="currentColor"/>'],
  'structured-data': ['amber', '<path d="M3 2.5v10M3 4h4M3 8h4M7 8v4h3M10 4h3M10 8h3M12 12h1"/><circle cx="8" cy="4" r=".7"/><circle cx="8" cy="8" r=".7"/>'],
  xml: ['amber', '<path d="M5 4L2 8l3 4M11 4l3 4-3 4M7 6h2M7 10h2"/>'],
  archive: ['amber', '<path d="M2.5 2h11v12h-11zM7 2v2h2v2H7v2h2v2M7 11h2v2H7z"/>'],
  audio: ['blue', '<path d="M2 6v4M5 3v10M8 5v6M11 2v12M14 6v4"/>'],
  design: ['purple', '<path d="M4 3h8M13 4v8M12 13H4M3 12V4M6 10l2-5 2 5z"/><path d="M2 2h2v2H2zM12 2h2v2h-2zM2 12h2v2H2zM12 12h2v2h-2z"/>'],
  security: ['amber', '<path d="M3 2h7l3 3v8H3zM10 2v3h3M5 5h3M5 7h2M8 11l-1 3 2-1 2 1-1-3"/><circle cx="9" cy="9.5" r="2"/>'],
  key: ['amber', '<circle cx="5" cy="5" r="3"/><path d="M7.2 7.2L13 13M10 10l2-2M12 12l2-2"/>'],
  notebook: ['amber', '<path d="M4 2h9v12H4zM2 4h3M2 8h3M2 12h3M8 5L6.5 7 8 9M10 5l1.5 2L10 9M7 11h4"/>'],
  database: ['blue', '<ellipse cx="8" cy="3.5" rx="5.5" ry="2"/><path d="M2.5 3.5v9c0 2.7 11 2.7 11 0v-9M2.5 8c0 2.7 11 2.7 11 0"/>'],
  log: ['secondary', '<path d="M5 3h8M5 7h8M5 11h8M2 10l1.5 1.5L2 13"/><circle cx="2.5" cy="3" r=".5" fill="currentColor"/><circle cx="2.5" cy="7" r=".5" fill="currentColor"/>'],
  // Tooling: original container-stack and construction glyphs, no brand artwork.
  docker: ['blue', '<path d="M2 5h12v8H2zM6 5v8M10 5v8M2 9h12M6 2h4v3H6z"/>'],
  build: ['secondary', '<path d="M3 3l3-1 4 4-2 2-4-4M7 7L2 12l2 2 5-5M10 3l3 3M12 2l2 2-2 2"/>']
};
const definitions = {};
for (const [name, [color, geometry]] of Object.entries(glyphs)) {
  const ink = ['secondary'].includes(color) ? t.icon : t[color];
  write(`icons/svg/${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g color="${ink}" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${geometry}</g></svg>\n`);
  definitions[name] = { iconPath: `./svg/${name}.svg` };
}
const fileExtensions = {};
const extensions = (icon, list) => list.split(' ').forEach(ext => fileExtensions[ext] = icon);
extensions('typescript', 'ts mts cts'); extensions('javascript', 'js mjs cjs'); extensions('react', 'tsx jsx');
extensions('python', 'py pyi pyw'); extensions('json', 'json jsonc json5'); extensions('html', 'html htm vue svelte');
extensions('css', 'css scss sass less'); extensions('markdown', 'md markdown mdx'); extensions('shell', 'sh bash zsh fish ps1');
extensions('config', 'ini conf cfg env editorconfig'); extensions('code', 'go rs c h cpp hpp cs java kt swift rb php lua');
extensions('shader', 'glsl vert frag wgsl'); extensions('image', 'png jpg jpeg webp gif svg ico avif');
extensions('document', 'txt rst'); extensions('film', 'film edl mov mp4 webm'); extensions('lock', 'lock');
extensions('pdf', 'pdf'); extensions('office', 'doc docx rtf odt');
extensions('presentation', 'ppt pptx odp'); extensions('spreadsheet', 'xls xlsx ods');
extensions('structured-data', 'yaml yml toml'); extensions('xml', 'xml xsd xsl xslt');
extensions('data', 'csv tsv'); extensions('database', 'sql sqlite sqlite3 db');
extensions('archive', 'zip rar 7z tar gz tgz bz2 xz'); extensions('audio', 'mp3 wav flac ogg aac m4a');
extensions('design', 'fig sketch xd ai psd'); extensions('notebook', 'ipynb');
extensions('security', 'pem crt cer'); extensions('key', 'key'); extensions('log', 'log');
extensions('docker', 'dockerfile containerfile'); extensions('build', 'gradle gradle.kts');
extensions('test', 'test.ts test.tsx spec.ts spec.tsx test.js test.jsx spec.js spec.jsx');
const folderNames = { src: 'folder-src', lib: 'folder-src', components: 'folder-src', scripts: 'folder-src',
  tests: 'folder-test', test: 'folder-test', __tests__: 'folder-test', '.vscode': 'folder-config', '.github': 'folder-config', config: 'folder-config' };
const icons = {
  $schema: 'vscode://schemas/icon-theme', iconDefinitions: definitions, file: 'file', folder: 'folder',
  folderExpanded: 'folder-open', rootFolder: 'folder', rootFolderExpanded: 'folder-open',
  hidesExplorerArrows: false, showLanguageModeIcons: false, fileExtensions,
  fileNames: { 'package.json': 'package', 'package-lock.json': 'lock', 'yarn.lock': 'lock', 'pnpm-lock.yaml': 'lock',
    '.gitignore': 'git', '.gitattributes': 'git', '.gitmodules': 'git', '.env': 'config', '.env.local': 'config',
    '.editorconfig': 'config', 'dockerfile': 'docker', 'containerfile': 'docker',
    'makefile': 'build', 'gnumakefile': 'build', 'gradle': 'build', 'gradlew': 'build', 'gradlew.bat': 'build',
    'build.gradle': 'build', 'settings.gradle': 'build', 'build.gradle.kts': 'build', 'settings.gradle.kts': 'build',
    'pom.xml': 'build', 'license': 'document',
    'readme.md': 'markdown', 'tsconfig.json': 'config', 'eslint.config.js': 'config', 'vitest.config.ts': 'test' },
  folderNames, folderNamesExpanded: Object.fromEntries(Object.entries(folderNames).map(([name, icon]) => [name, `${icon}-open`])),
  languageIds: { typescript: 'typescript', typescriptreact: 'react', javascript: 'javascript', javascriptreact: 'react',
    python: 'python', json: 'json', jsonc: 'json', html: 'html', css: 'css', scss: 'css', less: 'css',
    markdown: 'markdown', shellscript: 'shell', powershell: 'shell', yaml: 'structured-data', toml: 'structured-data',
    xml: 'xml', sql: 'database', csv: 'data', tsv: 'data', dockerfile: 'docker',
    go: 'code', rust: 'code', c: 'code', cpp: 'code', java: 'code', csharp: 'code', ruby: 'code', php: 'code' }
};
write('icons/obsidian-celluloid-icon-theme.json', adaptIcons(icons, noir, noirTokens, write));
console.log(`Built unchanged Light and Noir themes; ${Object.keys(glyphs).length} original glyphs and ${Object.keys(fileExtensions).length} extension associations, with contrast-selected Noir variants.`);
