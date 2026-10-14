# Design extraction and native mapping

The supplied files live under `references/`, although the request called the
directory `reference/`. All three were inspected: `screen.png`, `code.html` and
`DESIGN.md`. The screenshot leads visual decisions, actual HTML values resolve
implementation details, and the specification supplies broader intent.

## Palette

`design/tokens.json` is the source for generated assets. The full supplied
frontmatter palette is preserved as `design/reference-palette.json` for comparison.

| Role | Implemented value | Use |
| --- | --- | --- |
| Gallery chalk | `#FCF8FB` | Workbench canvas, gutters, title bar |
| Code paper | `#FFFFFF` | Editor, sidebar, terminal, menus, hovers |
| Gutter paper | `#FAF9FA` | Nearly white gutter with warm line numbers |
| Explorer selection | `#EAE7EA` | Neutral selected file rows; red keyboard focus |
| Icon ink | `#5F3F3A` | Warm generic glyph outlines |
| Structural chrome | `#F6F3F5` | Activity bar, inactive tabs, panel headers |
| Shelf | `#F0EDF0` | Hover states, widget selections, command center |
| Raised surface | `#EAE7EA` | Neutral pressed states, bracket match |
| Obsidian ink | `#1B1B1D` | Active tabs and UI labels |
| Carbon | `#0C0C0E` | Code, terminal, primary buttons and badges |
| Warm secondary | `#5F3F3A` | Attribute names and warm metadata |
| Neutral secondary | `#52525A` | Inactive navigation, descriptive labels |
| Filmic comment | `#6B4D47` | Italic comments |
| Readable gutter | `#7B625D` | Line numbers |
| Disabled | `#979099` | Disabled controls, ghost text; exempt from text contrast target |
| Deep slate | `#3F3F46` | Operators, punctuation |
| Hairline | `#E8E4E8` | Panel and control boundaries |
| Strong hairline | `#CFC6CC` | Active guides, bracket outlines |
| Vermilion text | `#C00007` | Keywords, focus, active tab, cursor |
| Recording signal | `#E7000B` | High energy signal/breakpoint and bright terminal red |
| Error | `#BA1A1A` | Errors and diagnostics |
| Cobalt text | `#0055D4` | Functions, numbers, links, modified resources |
| Cobalt signal | `#0767FF` | Preserved design token; small text uses darker cobalt |
| Cinema amber text | `#8E4E00` | Strings, types, warnings, dirty tab borders |
| Amber signal | `#FC941F` | Find-match fills, preserved signal swatch |
| Forest success | `#107C41` | Booleans, tests and added resources |
| Auxiliary purple / cyan | `#7947A8` / `#006F80` | Complete ANSI spectrum, optional bracket colors |
| Selected text fill | `#EDF1FF` | Light cobalt selection that preserves green text contrast |
| Active line | `#F2F1F3` | Subtle editor row |
| Error / amber / blue wash | `#FFDAD6` / `#FFDCC1` / `#DAE1FF` | Diagnostic and state surfaces |
| Success wash | `#E2F0E7` | Coverage and success wells |

Native overlay colors use RGBA hex, for example `#0055D412` for symbol occurrences
and `#107C4120` for inserted diff content. Large editor and panel surfaces are
opaque because transparent theme fills do not create workbench vibrancy.

## Typography extracted from the reference

| Style | Family | Size / line height | Weight | Letter spacing |
| --- | --- | --- | --- | --- |
| Display large | Geist | 32 / 38px | 600 | −0.03em |
| Display mobile | Geist | 26 / 32px | 600 | −0.025em |
| Headline medium | Geist | 22 / 28px | 500 | −0.02em |
| Headline small | Geist | 17 / 22px | 500 | −0.015em |
| Body large | Geist | 15 / 22px | 400 | −0.01em |
| Body medium | Geist | 13 / 18px | 400 | −0.005em |
| Body small | Geist | 11 / 16px | 400 | 0 |
| Code editor | JetBrains Mono | 13 / 20px | 450 | −0.01em |
| Code inline | JetBrains Mono | 12 / 16px | 400 | 0 |
| Technical label small | JetBrains Mono | 11 / 14px | 500 | 0.04em |
| Technical label extra small | JetBrains Mono | 9 / 12px | 600 | 0.08em |

The v0.2 preset converts editor tracking to −0.13px and uses 13px/20px at weight
400. The reference’s 450 weight remains an optional manual choice for variable
fonts; a regular face avoids heavier rounding on static font installations. Terminal line
height is approximately 20/13. Native themes can specify token color and
bold/italic/underline/strikethrough, but cannot assign different fonts or sizes to
comments, labels or syntax tokens. Geist, caps, display hierarchy and technical
label tracking therefore remain reference intent. No font is redistributed.

## Spacing, geometry and hierarchy

The specification uses an 8px base grid with 2px micro steps. Its named spacing is
xs 4px, sm/gutter 8px, md 12px, margin/loose gutter 16px, lg 20px and xl 32px.
Editor padding uses 12px and scrollbars use 8px; all control and pane spacing is
owned by VS Code. The HTML's rail is 56px and sidebar plus rail is 288px. The top
navigation is 64px and the status footer is 40px. These are reference dimensions,
not forced native dimensions. The main workspace uses 12 columns: editor/terminal
take 9 columns and the right inspector/minimap cards take 3 at wide viewports.
That auxiliary column is explicitly excluded in v0.2; the native editor expands
into the available space. No secondary-sidebar visibility setting is applied.

The intended hierarchy is an opaque white editor on chalk, structural chrome,
white floating hovers and command palette, then sparse operational color. The
screenshot shows white terminal rows even though the specification describes an
inset grey terminal. White is used for native terminal and grey for its header.

The specification's radii are 2/4/6/8/12px and fully rounded indicators. The HTML
actually maps default/lg/xl/full to 2/4/8/12px. Native radii and menu/palette
shadows cannot be themed. Flat surfaces and hairline boundaries carry the visual
hierarchy instead. The reference's 24/32px blur, dot-grid watermark, pulsing red
markers and 6px pane-splitter hit targets are not implemented through patches.

## Iconography

The screenshot uses Material Symbols Outlined: thin folder/terminal/film/sliders
glyphs and recording dots. Original SVG assets translate that vocabulary into
16px outlined glyphs on a 1.1px stroke grid, rounded caps and restrained accent
colors. The set covers generic files; closed/open roots and folders; source,
configuration and test folders; TS/JS, TSX/JSX, Python, JSON, markup, stylesheets,
Markdown, shell, common code languages, images, shaders, packages, locks, Git and
film files. Explorer expansion arrows remain available.

VS Code's [product icon API](https://code.visualstudio.com/api/extension-guides/product-icon-theme)
requires single-color glyphs in an icon font. File SVGs cannot replace built-in
controls through that API. The standard Codicons retain their tested meanings and
receive the workbench palette. A purpose-built font is deferred.

## Conflicts and resolutions

| Conflict | Resolution |
| --- | --- |
| Specification prose canvas `#FBFBFD` vs frontmatter/HTML `#FCF8FB` | Use the implemented warm chalk and screenshot's warm tint. |
| Prose ink `#0C0C0E` vs HTML `#1B1B1D` | Use carbon for editor/terminal text in v0.2; HTML ink for UI labels. |
| Vermilion swatch label `#E7000B` but its HTML dot uses primary `#B80006` | Use supplied surface-tint vermilion `#C00007` for stronger code/accent fidelity; recording red for signal. |
| Printed cobalt `#0055D4`, prose `#0066FF`, HTML `#0051CD` / `#0767FF` | Use printed `#0055D4` cobalt for code and links in v0.2; retain bright cobalt as a signal token. |
| Printed amber `#C26D00`, prose `#E58200`, HTML strings `#8E4E00` and type `#FC941F` | Use dark implemented string amber for strings and types to make 13px type readable. |
| Screenshot and HTML use red `true` and one red `useEffect`; prose asks for green success/booleans | Green boolean values and consistently cobalt functions provide a predictable native language system. |
| HTML comment rows use Geist and smaller text | Keep editor font/size; use warm italic comments. Native token font families are unsupported. |
| Prose grey terminal vs white screenshot/HTML | White terminal body with grey panel header. |
| Intended tertiary ink `#8E8E98` is faint at small size | Use warm line numbers at `#7B625D`; keep disabled affordances muted. |
| Original cobalt wash lowers green selection contrast below 4.5:1 | Lighten the selection to `#EDF1FF`. |
| Reference labels claim an overall AAA ratio of 15.8:1 | Do not repeat a universal rating. Measure each relevant pair; syntax targets 4.5:1. |
| Floating sidebar cards, theme picker and film widgets | The auxiliary column and all illustrative widgets are explicitly excluded; use normal native views/pickers. |

JSON's built-in grammar gives `true`, `false` and `null` the same
`constant.language.json` scope. They share green. Python singleton literals also
share a language-constant scope and use green. TS/JS null and undefined use red.
No unsupported lexical substitution or custom grammar is added to split them.

## Contrast and provider behavior

The validator measures all TextMate colors on paper, selection and active-row
fills; semantic foregrounds on paper; critical navigation, input, menu and widget
pairs; and all 16 ANSI foregrounds on white. The generated report lists every
tested pair. Disabled text and subtle structural hairlines are not ordinary
text and are not included in the 4.5:1 claim. Alpha overlays are composited for
calculation. Terminal programs can choose their own background/foreground pairs,
and language providers may supply custom semantic token classifications.

Official references used for implementation and validation:

- [Color theme extension guide](https://code.visualstudio.com/api/extension-guides/color-theme)
- [Supported theme colors](https://code.visualstudio.com/api/references/theme-color)
- [Semantic highlight guide](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)
- [File icon theme guide](https://code.visualstudio.com/api/extension-guides/file-icon-theme)
- [Extension packaging guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

## v0.2 native component hierarchy

Active tabs are white with a vermilion bottom accent; inactive tabs use warm
chrome and quieter separators. Focused Explorer rows use neutral `#EAE7EA` with
a translucent red outline. The minimap uses chrome with a red viewport tint at
alpha 18/24/30 hex for resting/hover/active states. Status indicators use readable
colored text on pale contextual fills. Modern framed UI receives the same surface
palette through the official `surface.*`, `modernEditorTab.*`, `modernActivityBar*`
and related color IDs. These colors do not enable a layout and are ignored by
older VS Code versions. See VISUAL-FIDELITY-v0.2.md for the comparison rationale.
