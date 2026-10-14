# Obsidian Celluloid v0.3.1 — icon refinement

This release expands the existing shared icon theme. Light and Noir color theme
JSON, palettes, settings presets, original 28 glyphs and existing 25 Noir variants
are unchanged. The extension/icon contribution identifiers remain unchanged.

## Audit and family coverage

The previous theme covered code, config, images and cinematic video well. Among
94 representative filenames covering the request and common tooling variants,
40 previously resolved to the default file glyph. Office documents, archives,
audio, design assets, notebooks, certificates, keys and tabular data were the
largest gaps. PDF used the broad prose document glyph; SQL used the code family;
Dockerfile/Makefile and YAML/TOML used config sliders.

There are now 45 original glyphs (17 additions), 129 extension associations,
27 exact filename associations and 29 language associations. Unrelated mappings,
folder icons and expanded-folder behavior are retained.

| Family / glyph | Explicit formats and key filenames | Decision |
| --- | --- | --- |
| PDF | pdf | Red folded page with an original vector-curve mark; distinct from prose |
| Office | doc, docx, rtf, odt | Blue bound prose page |
| Presentation | ppt, pptx, odp | Amber slide and easel |
| Spreadsheet | xls, xlsx, ods | Green worksheet grid |
| Document / Markdown | txt, rst; md, markdown, mdx | Reuse established prose and Markdown glyphs |
| Structured data | yaml, yml, toml | Amber indented tree; JSON/JSONC/JSON5 retain braces |
| XML | xml, xsd, xsl, xslt | Amber markup delimiters with paired rows |
| Tabular data | csv, tsv | Blue row/table glyph, not plain text |
| Config | ini, conf, cfg, env, editorconfig; .env, .env.local, .editorconfig | Reuse sliders |
| Code / web | js, jsx, ts, tsx, html, css, scss, sass, less, py, java, c, cpp, cs, php, rb, go, rs, kt, swift, sh, bash, zsh | Preserve established language glyphs and shared code family |
| Containers | dockerfile, containerfile; Dockerfile, Containerfile; dockerfile language mode | Original blue container stack, not a downloaded logo |
| Build | gradle, gradle.kts; Makefile, GNUmakefile, Gradle, gradlew, gradlew.bat, build.gradle[.kts], settings.gradle[.kts], pom.xml | Shared mechanical construction glyph |
| Package / lock / Git | package.json; pnpm-lock.yaml, yarn.lock, package-lock.json, lock; .gitignore, .gitattributes | Preserve specific package, lock and Git glyphs |
| Archive | zip, rar, 7z, tar, gz, tgz, bz2, xz | Amber compressed-container/zipper glyph |
| Image | png, jpg, jpeg, webp, svg, gif, ico, avif | Reuse image glyph |
| Audio | mp3, wav, flac, ogg, aac, m4a | Blue waveform |
| Video | mp4, mov, webm, film, edl | Reuse cinematic film-strip glyph |
| Design / product | fig, sketch, xd, ai, psd | Purple vector-control frame |
| Notebook | ipynb | Amber bound code cells |
| Database | sql, sqlite, sqlite3, db | Blue database cylinder |
| Log | log | Neutral indexed rows with a continuation arrow |
| Security | pem, crt, cer; key | Amber certificate/seal and separate key glyph; lockfiles retain padlock |

The family table is intentional: a dedicated association does not imply a unique
brand icon for every language or file extension. Shared silhouettes retain the
restrained visual language. TXT has its specific prose glyph, while unfamiliar
formats intentionally retain the default file glyph. No requested major type
uses that fallback.

Exact filename associations override extensions, so `pnpm-lock.yaml` stays a
lockfile, `package.json` stays a package, and `pom.xml` becomes build tooling.
Compound extensions protect `*.test.tsx`, `*.spec.js` and `*.gradle.kts`.
Case-insensitive lookup covers normal Dockerfile/Makefile casing. There are no
wildcard filename hacks. Language-mode fallbacks cover recognized custom filenames;
unknown extensions, unknown dotfiles and extensionless files without a mapped
language remain generic. This follows the [native file icon API](https://code.visualstudio.com/api/extension-guides/file-icon-theme#file-association).

## Geometry, contrast and preservation

All added assets use the existing 16×16 viewBox, 1.1px rounded strokes, precise
mechanical outlines and palette roles. They contain no text, embedded fonts,
scripts, raster imagery, external resources or copied brand artwork. The new
glyphs were rendered and reviewed at native 16px and enlarged 32px sizes in both
variants; see [the SVG contact sheet](ICON-PREVIEW.svg).

The existing contrast-selected generation handles Noir variants without a second
icon-theme contribution. There are 41 brighter same-geometry Noir assets in total;
four green glyphs meet the threshold on dark surfaces and are shared directly.
Native defaults serve dark themes and sparse Light overrides select the existing
Light ink. Geometry stays identical between a glyph and its Noir variant.

225 icon/background checks per theme cover Explorer root, hover/selection rows
and active/inactive tabs. Minimum tested contrast is 4.30:1 for Light and 3.07:1
for Noir, above the 3:1 icon threshold. Neither theme's backgrounds nor syntax
were changed to accommodate icons. The original green glyphs remain restrained;
other new accents receive brighter ink only where needed.

The original v0.2 baseline is retained without regeneration. This task explicitly
authorizes nine refinements to existing associations: PDF, SQL, YAML/YML/TOML,
Dockerfile, Makefile, and YAML/Dockerfile language modes. Those exact replacements
are recorded separately in `tests/fixtures/icon-refinements-v0.3.1.json`; every
other original mapping remains fixed. New associations have exact coverage
expectations in `tests/fixtures/icon-coverage.json`.

An additional baseline captured before this pass guards 33 v0.3.0 theme, palette,
preset and original Noir asset files. The same checks run on source, extracted
VSIX files and installed extension files. Existing icon assets are retained even
when an extension such as PDF gains a more specific association.

## Validation and package

- 54 automated tests pass with no skips, including all prior syntax/contrast cases.
- 188 mapping checks cover all 94 representative filenames in Light and Noir.
- Regressions reject a valid but generic mapping for PDF, ZIP, CSV, YAML/TOML, SQL
  or IPYNB; precedence and intentional unknown-file fallback are also tested.
- SVG XML, resource safety, definition usage, Light overrides and matching Noir
  geometry pass validation; 450 total icon/background checks pass.
- Both color themes retain their 450 supported IDs, 43 TextMate categories and
  30 semantic selectors; their original text and indicator contrast checks pass.
- Native desktop host validation checks both themes, shared icons and seven JSON
  schemas using a temporary profile. Archive and CLI installation checks validate
  shipped paths, coverage, both variants' icon contrast and preservation baselines.

Run `npm test`, `npm run test:host`, `npm run package`, `npm run test:package`
and `npm run test:install`. Reports appear in `dist/`, including
`icon-contrast-report.json`, `noir-icon-contrast-report.json`, `host-report.json`
and `install-report.json`. The latter records the exact installed VSIX hash.

Package: `dist/obsidian-celluloid-0.3.1.vsix`. Install through **Extensions:
Install from VSIX…** and select **Obsidian Celluloid Icons** through
**Preferences: File Icon Theme**. Either existing color theme remains available.
No user settings or normal-profile installation are changed during validation.

## Implementation files

`scripts/build.mjs` contains the added geometry and native associations. Shared
adaptation stays in `scripts/lib/icons.mjs`; `scripts/lib/validation.mjs` now
checks resolved Light as well as default Noir icon colors. Mapping/precedence
checks live in `scripts/lib/icon-coverage.mjs` and `tests/icon-coverage.test.mjs`.
Preservation and archive/install checks are extended for the explicit refinement
scope, while the Noir tests retain their previous assertions on original glyphs.
Version, README and changelog are updated. All generated assets remain checked in.
