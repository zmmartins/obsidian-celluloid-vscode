# Obsidian Celluloid Noir — design tokens

Noir is an additive native dark variant. The approved Light palette, generated
theme, typography preset and original SVG assets remain unchanged.

## Reference precedence and conflicts

The supplied files are at `references/dark/screen.png`, `code.html` and
`DESIGN.md` (the request's singular `reference/` directory does not exist).
The screenshot defines visual priorities, followed by the HTML's actual values,
then the design prose. Reference files are excluded from the VSIX.

The screenshot and HTML depict a deep `#0A0A0C` code stage and terminal, a
`#121216` navigation/chrome layer, elevated dark widgets, phosphor white code,
vermilion keywords, cobalt functions/symbols and amber strings/numbers. The
right-hand telemetry cards, decorative header, fake theme-picker card and extra
minimap are reference presentation elements; the native equivalents are the
actual theme picker, hover/suggestion widgets and editor minimap.

Important conflicts and deliberate decisions:

| Source discrepancy | Native decision |
| --- | --- |
| DESIGN.md frontmatter uses `#131316`, pink `#FFB3AD`, pale cobalt `#A3C9FF` and warm `#E7BCB9` text | Use the screenshot/HTML's deeper neutral layers and saturated small functional signals. No pink or warm gray text wash. |
| DESIGN.md prose uses core `#111114`, elevated `#16161A`, primary text `#EDEDF0` and red `#FF2E38` | Prefer actual HTML `#121216`, `#18181D`, `#F4F4F6`, `#FF3B30`, also identified by the screenshot swatch cards. |
| HTML uses translucent `#16161C` overlays and white border opacities | Use opaque `#18181D` native widgets and `#27272E` hairlines; the theme API cannot implement backdrop blur. |
| Screenshot gutter uses very muted `#52525B` | Lift normal line numbers to HTML muted `#787885` (4.54:1 on the editor); reserve `#52525B` for disabled/ghost text. Active line numbers are phosphor white. |
| Some metadata uses `#787885` on elevated/selected surfaces | Use `#A1A1AA` secondary text there to meet 4.5:1; retain subdued HTML `#8E8D98` comments. |
| Screenshot selected rows have a translucent red outline | Use neutral `#202026` rows and opaque red keyboard focus outlines for at least 3:1 indicator contrast. |
| Screenshot active tab has a red top and left frame | Use a native red top indicator; there is no per-tab left-border color. Light retains its red bottom indicator. |
| Prose suggests cobalt selection fills without a resolved value | Use opaque `#142030` so all token categories, including red, retain 4.5:1. Word/reference matches use transparent cobalt overlays. |
| HTML blue symbols coexist with amber primitive types and numeric literals | Noir uses amber numbers and built-in primitives in both TextMate and semantic rules; Light retains cobalt. |
| Screenshot advertises 15.8:1 / 15.1:1 contrast | Compute actual pairs rather than adopting decorative claims. Primary text is above 17:1 on the code canvas; tested gutter/ANSI gray is the 4.54:1 minimum. |

## Independent Noir palette

Source: `design/noir-tokens.json`. Shared role names allow the same workbench
categories to consume different palettes; `scripts/lib/noir.mjs` provides
component-specific decisions and syntax overrides.

| Role(s) | Value | Use |
| --- | --- | --- |
| canvas, paper, gutterSurface | `#0A0A0C` | Editor, gutter, terminal, active tab and deepest panes |
| chrome | `#121216` | Activity Bar, Explorer root, title/status bars, tab strip, breadcrumbs |
| shelf | `#18181D` | Inputs, quick pick, hover, suggestions, notifications, elevated menus |
| raised, explorerSelection | `#202026` | Selected/hovered rows and control surfaces |
| border | `#27272E` | Hairline partitions and widget frames |
| borderStrong | `#3F3F46` | Strong framing and native handles |
| ink, carbon | `#F4F4F6` | Primary text, variables, parameters, properties |
| muted, secondary, slate, icon | `#A1A1AA` | Secondary text, neutral operators, metadata, adaptive gray icons |
| comment | `#8E8D98` | Italic comments and Markdown quotes |
| gutter | `#787885` | Normal line numbers and readable ANSI black |
| disabled | `#52525B` | Disabled controls, ghost text and unavailable breakpoints |
| red, signal, error | `#FF3B30` | Keywords, errors, breakpoint/status signals, focus, tab/minimap indicators |
| errorWash | `#2A1417` | Error validation/status contexts and debugging status |
| blue | `#2997FF` | Functions, methods, symbols, links, editor caret, modified Git resources |
| blueBright | `#64B5FF` | Bright terminal blue |
| blueWash | `#102239` | Informational validation, remote status and incoming merge header |
| amber | `#FF9F0A` | Strings, numeric literals, types, warnings and find outlines |
| amberBright | `#FFB868` | Bright terminal yellow |
| amberWash | `#2D2114` | Warning validation/status contexts |
| green | `#30D158` | Booleans, success/testing states, Git additions |
| greenWash | `#102718` | Covered code and current merge header |
| purple | `#C39BFF` | Terminal magenta, secondary bracket category, adaptive image icon |
| cyan | `#64D2FF` | Terminal cyan and bracket category |
| selection | `#142030` | Opaque cobalt editor/terminal selections |
| line | `#18181D` | Active editor line |

The purple/cyan auxiliary colors complete functional terminal and bracket
coverage. They are not broad decorative surfaces.

## Native component mappings

The theme defines 450 supported color IDs. Shared categories cover editor/groups,
gutters/guides/brackets, Activity Bar/Explorer/trees, title bar/command center,
classic/modern tabs, breadcrumbs, panels/terminal/debugging, status contexts,
notifications, menus/quick picks/search/input validation, hover/IntelliSense,
Git/diff/merge/testing/diagnostics and minimap/scrollbar/overview ruler.

The editor caret is cobalt; the terminal caret is vermilion. Find overlays use
amber at `24`/`14` alpha, addition/deletion washes green/red at `18`, and
reference matches cobalt at `18`. The minimap viewport uses red `1A`/`26`/`33`
alpha for normal/hover/active states. Minimap syntax opacity is `D0`; neutral
scrollbars use secondary gray `30`/`48`/`60`. Guides use secondary gray `38`/`70`.
Overview marker colors retain their functional semantic accents. Standard
overview borders remain transparent. Widget shadows use black `80` alpha.

## Syntax and semantic agreement

All 43 TextMate categories and 30 semantic selectors are present. Native VS Code
grammars are tested for JS/JSX, TS/TSX, Python, JSON, HTML, CSS, Markdown and shell.

| Category | Noir treatment |
| --- | --- |
| Keywords, storage modifiers, word operators | Vermilion |
| Functions, methods, namespaces, decorators, HTML/JSX tags, CSS selectors | Cobalt |
| Strings, escapes' surrounding literals, numeric values, types/primitives, regex literals, CSS units | Amber (escape/interpolation markers remain red) |
| Variables, parameters, properties, standard library objects and JSON keys | Phosphor primary |
| Structural punctuation/operators, attributes and CSS property names | Neutral secondary |
| Comments/quotes | Subdued gray, italic |
| Booleans and inserted diff text | Emerald |
| Null/undefined and deleted diff text | Vermilion, subject to grammar scope limits below |
| Markdown headings/lists/links | Red headings/lists, blue links; primary emphasis and amber raw text |
| Deprecated code | Strikethrough, preserving its category where semantic tokens permit |

The native JSON grammar assigns one `constant.language.json` scope to booleans
and null, so all three use emerald in TextMate fallback. Python's singleton scope
similarly groups booleans and None. Theme rules do not parse source text. Semantic
tokens depend on language providers; provider classifications can alter fallback
colors. TS/JS built-in primitives use amber through `type.defaultLibrary` in Noir.

## Typography, icons and contrast

Both variants recommend 13px JetBrains Mono with a 20px editor line height and
the existing terminal sizing/fallbacks. The Noir preset differs from the exact
Light preset only in `workbench.colorTheme`. No settings or fonts are installed.

There is one shared file icon contribution. The native default associations serve
dark themes; a sparse `light` override restores every original Light association.
25 glyphs fail the 3:1 icon threshold on at least one dark surface and get brighter
ink using the same geometry; the three original green test/folder glyphs remain
legible and are reused. All 28 original SVG bytes and definition paths are retained.
See [native file icon theme overrides](https://code.visualstudio.com/api/extension-guides/file-icon-theme#file-association).

Each theme passes 269 tested text pairs at 4.5:1 and eight active indicators at
3:1. Noir also passes 140 icon/background pairs at 3:1. Disabled text, decorative
hairlines, minimap syntax pixels and guides are intentionally subdued; these
checks do not claim every rendered pixel or every transparent-overlay combination
meets text contrast. ANSI black is lifted to readable gray. ANSI colors also act
as terminal backgrounds, and applications may select arbitrary foreground/background
pairs; inspect the supplied terminal sample with your usual tools.

## Native boundaries

Native colors cannot reproduce Geist workbench typography, a dotted code canvas,
glass blur/transparency, glowing/pulsing signals, custom tab geometry, floating
cards, a duplicate minimap or telemetry decoration. Native minimap syntax depends
on the real buffer, and its size/visibility belong to user settings. Color IDs
for modern framed surfaces only apply when VS Code already uses that interface;
declaring them never changes layout. High contrast modes remain separate themes.
