# First public release: 0.3.0

The public version is deliberately 0.3.0, including the icon refinements from the
local 0.3.1 iteration. Both color themes, all icon mappings, syntax rules, palettes
and presets are preserved exactly during release preparation. No GitHub release
or Marketplace publication has been performed.

## Configuration still needed

Choose and register your real Marketplace publisher ID. Create or identify the
actual public GitHub repository. The draft manifest intentionally omits
`publisher`, `repository`, `homepage` and `bugs` rather than committing invented
identities or placeholder URLs. `private: true` prevents accidental npm publishing;
it does not make the GitHub repository or Marketplace extension private.

Once those values are known, configure them locally:

```sh
npm run release:configure -- "$PUBLISHER_ID" "$GITHUB_REPOSITORY_URL"
```

Set the two environment variables to the real values first. The repository URL
must be the HTTPS GitHub repository URL, without credentials or a query. This
command changes metadata only, retaining version 0.3.0. It does not create a
repository, upload files, contact Marketplace, or authenticate a publisher.

## Validate and package

Use Node 22+ (24 used for validation), then:

```sh
npm ci
npm test
npm run test:host
npm run release:audit
npm run package
npm run test:package
npm run test:install
```

`npm run package` requires the real publisher and repository metadata. It uses the
installed official `@vscode/vsce`, includes the public assets, and rewrites README
image/document links to the actual GitHub repository. `HEAD` is used for repository
links; optionally set `OBSIDIAN_GITHUB_BRANCH` to an existing branch or release tag
before packaging for pinned links. Do not use an unpublished tag until the images
are available at that ref. Packaging never publishes.

Output: `dist/obsidian-celluloid-0.3.0.vsix`. Confirm the public repository serves
the logo and both screenshot PNGs over HTTPS before Marketplace upload. Local
archive checks cannot certify live image hosting for an unknown repository.

Before the identity is configured, the independent offline packaging check is:

```sh
npm run package:check
node scripts/check-package.mjs dist/release-review/obsidian-celluloid-0.3.0-review.vsix
```

The installed VSCE explicitly supports publisher-free local test packaging.
This produces a clearly marked **review artifact**, with local image links and
no finalized publisher. It must not be uploaded as the Marketplace release.
The normal release packaging command does not use the review exceptions.

## GitHub preparation

Commit source, generated themes/icons, public PNG assets, editable logo vector,
README, changelog, license, tests and lockfile. Reference images/HTML, dependencies,
VSIX/build outputs, logs, local secrets and private configuration are ignored.
Existing reference material is not redistributed. Review `git status` before
pushing, especially if files were already tracked before ignore rules existed.

This task has not initialized a repository, added a remote, pushed a branch,
created a tag or created a GitHub release. Use your actual repository and preferred
Git workflow when ready. Keep the complete MIT attribution. Publisher account
verification, extension-name availability and final public release authorization
remain owner steps.

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
