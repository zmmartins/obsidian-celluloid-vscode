# Asset provenance and redistribution

| Asset | Origin | Distribution |
| --- | --- | --- |
| Theme JSON and generation source | Original project implementation | MIT; retain the repository LICENSE |
| 45 mechanical SVG glyphs and 41 Noir ink variants | Original path geometry authored in the project generator; no third-party icon packs, downloaded artwork or brand logos | MIT; SVGs ship as native file-icon resources |
| OC logo vector and 256×256 PNG | Original geometric reconstruction of the project owner's supplied OC reference | MIT; PNG ships, editable SVG remains in repository |
| Light/Noir screenshots | Actual isolated VS Code workbench showing the project's sample files and icons | Public documentation images; no desktop-wide or unrelated-window capture |
| JetBrains Mono | Separately installed local font used in screenshots and recommended in optional presets | No font files are redistributed |
| Native Codicons and VS Code UI | Microsoft Visual Studio Code | Captured as part of actual application screenshots; no native UI assets copied into the extension |
| Stitch/design/logo reference files | Supplied project references; independent source rights not asserted | Excluded from VSIX and default Git tracking |

The existing MIT copyright attribution is intentionally retained. Existing file
icon paths are the original project geometry, not copied corporate marks. Named
file formats identify associations; the glyphs are generic technical silhouettes.
The OC monogram uses paths rather than a bundled font. The build-time logo renderer
reads the editable vector and produces PNG directly, without resampling the reference.

No independent legal clearance of supplied reference materials is claimed. Those
files are not redistributed. The project owner should retain their rights records
for the original OC identity before the public release.
