import fs from 'node:fs';
import { readJSON } from './lib/validation.mjs';
import { validateReleaseAppearance, validateReleaseAssets, validateMarkdownLinks, scanReleaseText } from './lib/release-validation.mjs';
const files = [];
const walk = directory => {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', 'references', 'reference', '.git', '.cache', '.aws', '.codex', '.agents'].includes(item.name)) continue;
    const file = directory === '.' ? item.name : `${directory}/${item.name}`;
    if (item.isDirectory()) walk(file); else files.push(file);
  }
};
walk('.');
validateReleaseAssets();
const manifest = readJSON('package.json');
const manualConfiguration = [];
if (!manifest.publisher) manualConfiguration.push('real Marketplace publisher ID');
if (!manifest.repository || !manifest.homepage) manualConfiguration.push('actual GitHub repository URL and homepage');
const report = {
  version: manifest.version, status: manualConfiguration.length ? 'prepared; manual identity configuration pending' : 'ready for packaging',
  appearanceArtifactsPreserved: validateReleaseAppearance(), filesScanned: scanReleaseText('.', files),
  localReferencesChecked: validateMarkdownLinks('.'), pricing: manifest.pricing,
  manualConfiguration, publishingPerformed: false,
  publicAttribution: 'MIT copyright holder retained in LICENSE; no publisher identity is invented by this audit',
  limits: 'Pattern-based source audit; external image hosting and Marketplace identity require the actual public repository and publisher.'
};
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/release-audit-report.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
