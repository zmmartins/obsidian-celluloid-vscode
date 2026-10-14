# First public release: 0.3.1

Current identity: `zmmartins.obsidian-celluloid@0.3.1`.
Repository: https://github.com/zmmartins/obsidian-celluloid-vscode.
The manifest contains the registered publisher, repository, homepage and issues URL.
`private: true` prevents accidental npm publishing; it does not make this GitHub
repository or Marketplace extension private. No publication is performed by these scripts.

Both color themes, all icon mappings, syntax rules, palettes and presets remain
unchanged. Historical v0.2/v0.3.0 baseline versions describe approved appearance
snapshots. Release version, archive filename and installed identifier are derived
from the current `package.json`; baselines never override release metadata.

## Validate and package

Use Node 22+ (24 used for validation), then:

```sh
npm ci
npm test
npm run package
npm run test
npm run test
npm run test:package
npm run test:install
npm run release:audit
```

`npm run package` requires the real publisher and repository metadata. It uses the
installed official `@vscode/vsce`, includes the public assets, and rewrites README
image/document links to the actual GitHub repository. `HEAD` is used for repository
links; optionally set `OBSIDIAN_GITHUB_BRANCH` to an existing branch or release tag
before packaging for pinned links. Do not use an unpublished tag until the images
are available at that ref. Packaging never publishes.

Output: `dist/obsidian-celluloid-0.3.1.vsix`. Confirm the public repository serves
the logo and both screenshot PNGs over HTTPS before Marketplace upload. Local
archive checks cannot certify live image hosting without checking the live repository.

An independent local review packaging check is also available:

```sh
npm run package:check
node scripts/check-package.mjs dist/release-review/obsidian-celluloid-0.3.1-review.vsix
```

This produces a clearly marked **review artifact**, with local image links and
the current manifest metadata. It must not be uploaded as the Marketplace release.
The normal release packaging command does not use the review exceptions.

## GitHub preparation

Commit source, generated themes/icons, public PNG assets, editable logo vector,
README, changelog, license, tests and lockfile. Reference images/HTML, dependencies,
VSIX/build outputs, logs, local secrets and private configuration are ignored.
Existing reference material is not redistributed. Review `git status` before
pushing, especially if files were already tracked before ignore rules existed.

This task has not initialized a repository, added a remote, pushed a branch,
created a tag or created a GitHub release. Use your actual repository and preferred
Git workflow when ready. Keep the complete MIT attribution. Publisher authentication,
Marketplace name/version availability and final public release authorization remain
owner steps. The publisher ID itself is configured.

## Audit evidence

- `dist/release-audit-report.json`: metadata readiness, appearance hashes, source
  scan, local Markdown references and remaining manual configuration.
- `dist/host-report.json`: native theme switching and JSON schema validation.
- `dist/screenshot-report.json`: actual VS Code version and capture method.
- Existing text/indicator and Light/Noir icon contrast reports in `dist/`.
- Archive checks: every contribution and SVG path, PNG dimensions, local document
  references, excluded directories and preserved theme/icon bytes.

The privacy scan uses focused patterns for private paths, private keys and common
credentials; it is not a proof that every possible secret format is absent.
It reports filenames/rules without echoing secret values. The MIT copyright name
is retained as intentional public attribution. No login token is needed to package.
Keep publishing credentials outside the repository.

See [official manifest metadata](https://code.visualstudio.com/api/references/extension-manifest)
and [Marketplace publishing guidance](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
for publisher registration and authentication when you decide to publish.

## Stale artifact diagnosis

The previous `dist/obsidian-celluloid-0.3.1.vsix` was an obsolete local icon-pass
archive: it named publisher `josemariapereira` and lacked the new public docs and
Marketplace PNG. The current `.vscodeignore` includes `docs/FILE-ICONS.md`,
`docs/ASSET-PROVENANCE.md` and `docs/RELEASE.md` correctly. Rebuild before validating.
Archive and install checks now compare publisher/name/version and release metadata
against the current manifest before checking contents or installing. A wrong
publisher or stale version produces an explicit rebuild error. Required docs,
logo, screenshots, native theme/icon assets, and private/build exclusions stay strict.
