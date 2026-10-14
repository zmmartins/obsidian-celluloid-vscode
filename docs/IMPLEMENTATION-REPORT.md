# Obsidian Celluloid v0.2.0 implementation report

A refined declarative **Obsidian Celluloid (Light)** theme and **Obsidian Celluloid
Icons** theme, with an optional appearance preset, F5 launch setup, language
samples, validation tools and official-tooling VSIX. The extension remains
activation-free with no runtime dependencies.

The supplied screenshot comparison informs warmer gutters/navigation, carbon
code, refined syntax accents, softer partitions, neutral Explorer selection,
red tab/minimap accents, quieter status states and matching widget surfaces.
Official modern UI colors handle framed surfaces without enabling a new layout.
Original SVGs have slimmer strokes, warmer generic ink, a simpler JSX glyph and
test/spec associations. The preset retains JetBrains Mono at 13px/approximately
20px rows and refines weight, compact density, minimap and navigation settings.

No custom sidebar, decorative panel, telemetry, dashboard, duplicate minimap or
spec card is implemented. Existing secondary-sidebar visibility is untouched.
No activation code, custom CSS, JavaScript injection, workbench patch, font bundle
or unrelated-project modification is introduced. Pane dimensions require manual
adjustment. Global Geist UI typography, per-token fonts, custom geometry, blur,
grain and independent active-gutter ticks remain outside native color theming.

Validation covers 450 documented colors, 43 TextMate rules, 30 semantic selectors
and 28 SVG assets. All 23 automated tests pass without skips. Real grammars verify
55 token colors and eight complete samples. All existing tests remain; new checks
protect semantic object/function distinctions and the excluded custom UI scope.
269 text contrast pairs meet the unchanged 4.5:1 target, with a minimum of 4.68:1.
Eight active indicator pairs also meet 3:1, with a minimum of 3.32:1.

Native host checks cover preset registration/values and JSON schemas, including
the preset as temporary workspace settings. Exact version/outcome is recorded
in `dist/host-report.json`. `npm run package` runs the checks and official
`@vscode/vsce`, then validates shipped contributions, icons, preset and docs.
Output: `dist/obsidian-celluloid-0.2.0.vsix`. Isolated CLI installation checks
installed assets and records the final SHA-256 in `dist/install-report.json`.
No normal user profile is modified by these tests. The v0.1.0 VSIX is retained.

Source palette: `design/tokens.json`; mappings/scopes/glyphs: `scripts/build.mjs`.
Generated assets live in `themes/` and `icons/`. Package output excludes reference
screenshots, development scripts/tests, dependencies and temporary data.

The supplied baseline and target were inspected directly. Their different sizes,
content and display scaling prevent a useful pixel score. A new installed v0.2
screenshot and exhaustive interactive visual review are not claimed. Review the
installed version after merging optional preset keys and balancing pane sizes;
check long paths, terminal tools and semantic providers during normal work.
Minimum-release, other-platform and Ventura-specific performance remain unverified.

See DESIGN-TOKENS.md for extraction and VISUAL-FIDELITY-v0.2.md for prioritized
visual differences, the four configuration layers, manual layout and compromises.
