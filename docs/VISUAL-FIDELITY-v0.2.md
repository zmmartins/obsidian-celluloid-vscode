# Obsidian Celluloid v0.2.0 — Native Visual Fidelity Refinement

## Reference analysis

The supplied files live under `references/`, rather than `reference/`. The
specification, HTML, original screenshot and comparison images were inspected.
`screen.png` and `comparison/stitch-target.png` are byte-identical. The current
workspace capture is 2880×1602; the target is 1600×1280. Their different content,
aspect ratio and display scaling prevent a meaningful pixel-difference score.
The comparison concerns hierarchy and relative proportions, not inferred font
settings or literal screenshot pixels.

The current capture already has JetBrains Mono, the light palette and custom
icons. Its wide/deep Explorer, bright filename decorations, busy JSX glyphs,
long breadcrumbs, prominent minimap and tall terminal weaken the central code
focus. Rainbow braces and a pinned editor header are visible; these depend on
appearance settings as well as the theme.

The target uses white paper, faint warm gutters, strong obsidian text, red
keywords, blue functions, amber strings, warm italic comments and chalk chrome.
Its auxiliary column and fictional film controls are explicitly excluded.

## Prioritized comparison

| Priority | Current difference | v0.2 decision | Control |
| --- | --- | --- | --- |
| 1 | Tall terminal consumes much more height than the target drawer | Recommend a 160–200 logical pixel bottom panel; preserve normal input and controls | Manual layout |
| 1 | Explorer filenames and selection carry prominent blue state color | Neutral selected row, warm icon ink, red focus; optional filename colors off with Git badges on | Theme + preset |
| 1 | Tabs/navigation appear oversized and busy | White active tab, red bottom accent, warm inactive text, soft separators, compact density | Theme + preset |
| 1 | Framed surfaces do not all use legacy color IDs | Official modern surface, tab and activity colors align them with the palette | Theme |
| 2 | Grey gutter and softer code ink | Nearly white gutter, readable warm indices, carbon editor/terminal text and neutral active row | Theme |
| 2 | Library objects such as `window` compete with red keywords | Library objects, properties and parameters carbon; methods/functions cobalt | TextMate + semantic |
| 2 | Tall, prominent minimap with grey viewport | 60-column scale-1 native minimap, chalk backing, quieter syntax opacity, red viewport tint | Theme + preset |
| 2 | Breadcrumbs repeat file and symbol chains | Keep file path; omit symbol trail | Preset |
| 2 | Atom icons add density to nested JSX files | Original component glyph replaces intersecting orbits; SVG strokes refined to 1.1px | File icons |
| 3 | Metadata competes with primary code | Warm status labels and pale contextual indicator fills | Theme |
| 3 | Guides and partitions crowd white surfaces | Softer hairlines, translucent indent guides, tree guides on hover, subtle native widget shadow | Theme + preset |
| 3 | Text appears heavier, though its settings cannot be established from an image | Recommend regular 400; retain 13px/20px and −0.13px tracking | Preset |

Classic/connected tabs can display the vermilion underline. Modern pill tabs may
represent selection through their background/action surfaces instead. Both sets
of official colors are supplied; no experimental layout or tab style is enabled.

## Four configuration layers

### Theme colors and icons

450 supported workbench colors, 43 TextMate rules, 30 semantic selectors and 28
original SVG assets. Palette source is `design/tokens.json`; mappings, scope rules
and glyph geometry are in `scripts/build.mjs`. The refined signals are vermilion
`#C00007`, cobalt `#0055D4`, dark amber `#8E4E00` and forest `#107C41`.

The minimap viewport uses red with 18/24/30 hex alpha for resting, hover and drag
states. Explorer selection uses `#EAE7EA`. Carbon code uses `#0C0C0E`; gutters use
`#FAF9FA`. Borders become `#E8E4E8`. Status indicators use readable colored text
on pale contextual fills. Hovers, menus, suggestions and notifications share the
same surface hierarchy.

Bright amber type text remains darkened for readability. Booleans stay green
despite the target's red `true`. JSON/Python shared literal scopes remain
documented. Deprecated tokens retain strikethrough. Language providers still
control semantic classification; the theme supplies colors, not a provider.

### Optional appearance settings

Review and merge `presets/obsidian-celluloid.settings.json` manually. It preserves
JetBrains Mono at 13px and approximately 20px rows, recommends weight 400 instead
of 450, narrows the minimap, quiets filename decorations and guides, omits symbol
breadcrumbs and uses supported compact density. Weight 400 avoids heavier font
rounding when a static font lacks a 450 face. Variable-font users may choose 450.

The existing optional settings disabling bracket rainbow coloring and sticky
editor headers remain. Breakpoints, glyph margins, Explorer expand arrows, Git
badges, terminal controls, diagnostics and semantic highlighting remain available.
Review conflicting workspace/theme-specific overrides yourself; none are removed.

`window.density.layout` applies to newer framed VS Code layouts. Earlier versions
may ignore it and the modern color IDs. Compact tab height has a separate setting.
No experimental layout or transparency setting is enabled. The preset never
applies itself and contains no secondary-sidebar visibility setting.

### Manual workspace layout

Keep Explorer left, editor central and terminal bottom. Start with Explorer
230–260 logical pixels wide, excluding the activity bar, and a bottom panel
160–200 logical pixels high (about 5–7 terminal lines plus toolbar). Expand for
long output as needed. Leave central space for about 80–100 code columns.

Use **View: Move Panel To Bottom** for existing panel state; the default-location
setting does not reposition a persisted layout. Use **View: Reset Zoom** as a
starting point if the entire interface is oversized, then adjust for comfort.
Do not copy raw screenshot dimensions between Retina and logical-pixel scales.

### Native limits and excluded features

Global Geist UI font, per-token fonts/sizes, exact control geometry, tab/status
label typography, zero-padded line numbers and an independent red active-gutter
tick cannot be assigned by a color theme. Native shadows and colors approximate
depth. No blur, grain, CSS, injected script, workbench patch or font bundle is added.
Built-in controls retain Codicons.

No custom secondary sidebar, theme picker panel, telemetry, dashboard, duplicate
minimap or specification card is created. No command opens or hides an existing
secondary sidebar. Existing native views continue to inherit shared theme colors.

## Performance and validation

The extension remains activation-free with zero runtime dependencies, polling,
animation loops or webviews. Tiny static SVGs and a restrained minimap avoid extra
runtime work on the Intel MacBook Pro. No Apple Silicon feature is required.
Ventura-specific hardware performance has not been benchmarked.

- All 23 tests pass without skips. All previous tests remain; the JSON-key color
  expectation changes to carbon to reflect the new palette.
- Real VS Code grammars verify 55 token-color expectations and eight complete
  samples across TS/TSX, JS/JSX, Python, JSON, HTML, CSS, Markdown and shell.
- 269 contrast pairs meet the unchanged 4.5:1 threshold; minimum is 4.68:1.
  Semantic selection/active-line and additional native UI states are now checked.
  Eight active cursor/focus/tab/panel indicators additionally meet 3:1, with a
  minimum of 3.32:1 after alpha compositing; disabled/inactive controls are excluded.
- All 450 color IDs match the official reference snapshot; theme structure,
  semantic selectors, SVG XML/view boxes, associations and paths validate.
- New safeguards reject custom UI contributions and secondary-sidebar settings.
- Native host validation checks registered preset values and JSON schemas for
  the manifest, theme, icons and preset saved as temporary workspace settings.
  Exact version/outcome: `dist/host-report.json`.
- Official VSIX packaging and archive checks: `npm run package`.
  Isolated installation and checksum: `npm run test:install`, recorded in
  `dist/install-report.json`.

The supplied current image is a pre-refinement baseline. No new installed v0.2
screenshot or numerical fidelity score is claimed. Next review: install the VSIX,
merge desired preset keys, balance panes manually and compare the same code at the
same zoom. Older-release and other-platform GUI checks remain unverified.

## Official references

- [Supported theme colors, including modern surfaces](https://code.visualstudio.com/api/references/theme-color)
- [Color theme contributions](https://code.visualstudio.com/api/extension-guides/color-theme)
- [Semantic highlighting](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)
- [File icon themes](https://code.visualstudio.com/api/extension-guides/file-icon-theme)
