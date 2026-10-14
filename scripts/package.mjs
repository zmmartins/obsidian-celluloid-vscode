import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { readJSON } from './lib/validation.mjs';
import { releaseIdentity } from './lib/release-identity.mjs';
const manifest = readJSON('package.json');
const review = process.argv.includes('--check');
if (!review && (!manifest.publisher || !manifest.repository?.url || !manifest.homepage))
  throw new Error('Release identity is pending. Supply the real publisher and repository with npm run release:configure -- PUBLISHER_ID https://github.com/OWNER/REPOSITORY. Use npm run package:check for a local publisher-free review package.');
const identity = releaseIdentity(manifest, { requirePublisher: !review });
const out = review ? `dist/release-review/${identity.reviewArtifactName}` : `dist/${identity.artifactName}`;
fs.mkdirSync(review ? 'dist/release-review' : 'dist', { recursive: true });
const args = ['node_modules/@vscode/vsce/vsce', 'package', '--no-dependencies', '--out', out];
if (review) args.push('--allow-missing-repository', '--no-rewrite-relative-links');
else args.push('--githubBranch', process.env.OBSIDIAN_GITHUB_BRANCH || 'HEAD');
const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status || 1);
const check = spawnSync(process.execPath, ['scripts/check-package.mjs', out], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status || 1);
console.log(review ? 'Review package only: image links remain local; publisher metadata follows the current manifest. This is not a Marketplace release artifact.' : `Release VSIX packaged: ${identity.versionedId}; nothing was published.`);
