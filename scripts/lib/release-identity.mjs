import assert from 'node:assert/strict';

// Release metadata comes from the current manifest. Appearance baseline versions
// describe historical snapshots and must never determine a release identity.
export function releaseIdentity(manifest, { requirePublisher = true } = {}) {
  assert.match(manifest.name, /^[a-z0-9][a-z0-9-]*$/, 'Invalid extension name');
  assert.match(manifest.version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, 'Invalid stable release version');
  if (requirePublisher || manifest.publisher !== undefined)
    assert.match(manifest.publisher || '', /^[a-z0-9][a-z0-9-]*$/i, 'Configure the registered publisher ID');
  const extensionId = manifest.publisher ? `${manifest.publisher}.${manifest.name}` : undefined;
  return {
    name: manifest.name, publisher: manifest.publisher, version: manifest.version,
    extensionId, versionedId: extensionId ? `${extensionId}@${manifest.version}` : undefined,
    artifactName: `${manifest.name}-${manifest.version}.vsix`,
    reviewArtifactName: `${manifest.name}-${manifest.version}-review.vsix`,
    installedDirectory: extensionId ? `${extensionId}-${manifest.version}` : undefined
  };
}

export function validatePackageIdentity(packaged, current) {
  const identity = releaseIdentity(current, { requirePublisher: current.publisher !== undefined });
  for (const key of ['name', 'publisher', 'version', 'icon', 'pricing', 'license', 'repository', 'homepage', 'bugs']) {
    assert.deepEqual(packaged[key], current[key], `Stale or incorrect VSIX ${key}; rebuild with npm run package before validating or installing`);
  }
  assert.deepEqual(packaged.contributes, current.contributes, 'Packaged theme/icon contributions differ from the current manifest');
  return identity;
}
