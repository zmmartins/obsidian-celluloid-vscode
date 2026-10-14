import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../scripts/lib/validation.mjs';
import { validateReleaseAppearance, validateReleaseAssets, validateMarkdownLinks, scanReleaseText } from '../scripts/lib/release-validation.mjs';
import { releaseIdentity, validatePackageIdentity } from '../scripts/lib/release-identity.mjs';

test('release preparation preserves every current theme, icon, palette and preset byte', () => {
  assert.equal(validateReleaseAppearance(), 95);
  const manifest = readJSON('package.json');
  const identity = releaseIdentity(manifest);
  const lock = readJSON('package-lock.json');
  assert.equal(lock.version, identity.version, 'Lockfile tracks the current release version');
  assert.equal(lock.packages[''].version, identity.version);
  assert.equal(lock.name, identity.name);
  assert.equal(manifest.pricing, 'Free');
  assert.equal(manifest.icon, 'assets/marketplace-icon.png');
  assert.equal(manifest.displayName, 'Obsidian Celluloid');
  assert.deepEqual(manifest.categories, ['Themes']);
});
test('current manifest identity rejects stale publisher, version and name in an archive', () => {
  const manifest = readJSON('package.json');
  const identity = validatePackageIdentity(structuredClone(manifest), manifest);
  assert.equal(identity.extensionId, `${manifest.publisher}.${manifest.name}`);
  assert.equal(identity.versionedId, `${manifest.publisher}.${manifest.name}@${manifest.version}`);
  for (const [key, value] of [
    ['publisher', 'josemariapereira'],
    ['version', manifest.version === '0.3.0' ? '0.3.1' : '0.3.0'],
    ['name', `${manifest.name}-stale`]
  ]) {
    assert.notEqual(value, manifest[key]);
    assert.throws(() => validatePackageIdentity({ ...manifest, [key]: value }, manifest), /Stale or incorrect VSIX/);
  }
});
test('real public PNG assets and all local documentation references resolve', () => {
  validateReleaseAssets();
  assert.ok(validateMarkdownLinks('.') >= 10);
});
test('privacy audit rejects credentials and private paths without logging their values', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-audit-test-'));
  try {
    const file = 'fixture.md';
    for (const content of ['gh' + 'p_' + 'a'.repeat(32), '/' + 'Users/' + 'private-account/document']) {
      fs.writeFileSync(path.join(temp, file), content);
      assert.throws(() => scanReleaseText(temp, [file]), /Release text contains/);
    }
    fs.writeFileSync(path.join(temp, file), 'Original project artwork. MIT licensed.');
    assert.equal(scanReleaseText(temp, [file]), 1);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
