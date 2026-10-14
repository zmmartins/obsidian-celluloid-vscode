import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readJSON } from './validation.mjs';

export function validateReleaseAppearance(base = '.', { packaged = false } = {}) {
  const baseline = readJSON('tests/fixtures/release-appearance-v0.3.1.json');
  for (const [file, hash] of Object.entries(baseline.sha256)) {
    if (packaged && file.startsWith('design/')) continue;
    assert.equal(createHash('sha256').update(fs.readFileSync(path.join(base, file))).digest('hex'), hash, `Release changed appearance: ${file}`);
  }
  assert.deepEqual(readJSON(path.join(base, 'package.json')).contributes, baseline.contributions, 'Theme/icon contributions changed');
  return Object.keys(baseline.sha256).filter(file => !packaged || !file.startsWith('design/')).length;
}

export function pngSize(file) {
  const buffer = fs.readFileSync(file);
  assert.ok(buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `Invalid PNG: ${file}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

export function validateReleaseAssets(base = '.') {
  assert.deepEqual(pngSize(path.join(base, 'assets/marketplace-icon.png')), { width: 256, height: 256 });
  for (const variant of ['light', 'noir']) {
    const size = pngSize(path.join(base, `assets/screenshots/${variant}.png`));
    assert.ok(size.width >= 800 && size.height >= 500, `Release screenshot too small: ${variant}`);
  }
}

export function validateMarkdownLinks(base, packaged = false) {
  const normalize = file => {
    if (!packaged) return file;
    const aliases = { 'README.md': 'readme.md', 'CHANGELOG.md': 'changelog.md', LICENSE: 'LICENSE.txt' };
    return aliases[file] || file;
  };
  const markdown = [normalize('README.md'), normalize('CHANGELOG.md')];
  if (fs.existsSync(path.join(base, 'docs'))) {
    markdown.push(...fs.readdirSync(path.join(base, 'docs')).filter(file => file.endsWith('.md')).map(file => `docs/${file}`));
  }
  let checked = 0;
  for (const file of markdown) {
    const source = fs.readFileSync(path.join(base, file), 'utf8');
    for (const match of source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      const link = match[1].split(/\s+"/)[0];
      if (/^(https?:|mailto:|#)/.test(link)) continue;
      const target = normalize(path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURIComponent(link.split('#')[0]))));
      assert.ok(fs.existsSync(path.join(base, target)), `Broken packaged reference: ${file} -> ${link}`);
      checked++;
    }
  }
  return checked;
}

export function scanReleaseText(base, files) {
  const rules = [
    ['private user path', /(?:\/Users\/[^\s/]+\/|\/home\/[^\s/]+\/|[A-Z]:\\Users\\[^\s\\]+\\)/i],
    ['private key material', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
    ['GitHub token', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}\b/],
    ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
    ['credential assignment', /(?:password|api[_-]?key|access[_-]?token|client[_-]?secret)\s*[=:]\s*["'][A-Za-z0-9+/=_-]{16,}["']/i]
  ];
  const findings = [];
  for (const file of files) {
    if (!/\.(?:json|md|txt|mjs|cjs|swift|yml|yaml|html|css|svg|ts|tsx|py|sh)$/.test(file) && !['LICENSE', '.gitignore', '.vscodeignore'].includes(file)) continue;
    const source = fs.readFileSync(path.join(base, file), 'utf8');
    for (const [name, pattern] of rules) if (pattern.test(source)) findings.push({ file, rule: name });
  }
  assert.deepEqual(findings, [], 'Release text contains private paths or potential credentials (values intentionally omitted)');
  return files.length;
}
