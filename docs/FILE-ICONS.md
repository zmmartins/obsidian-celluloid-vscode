# File icon coverage

Obsidian Celluloid uses original mechanical SVGs at native 16px size: 1.1px
rounded strokes, precise outlines and restrained functional accents. There are
45 glyphs with 41 same-geometry brighter variants where dark surfaces need them.

PDF uses a folded fixed-layout page, office files use prose/slide/worksheet
silhouettes, CSV/TSV use a table, and YAML/TOML use an indented structured-data tree.
JSON retains its braces; XML uses markup delimiters. Archives share a zipper,
audio a waveform, design files a vector-control frame, notebooks bound code
cells, SQL a database cylinder, certificates a seal and keys a separate key glyph.
Existing language, config, image and cinematic film-strip families remain intact.

Exact filename matches take precedence over extensions: `package.json` remains
a package, `pnpm-lock.yaml` remains a lockfile and `pom.xml` maps to build tooling.
Compound extensions retain test/spec associations and Gradle Kotlin scripts.
Dockerfile, Containerfile, Makefile, GNUmakefile, Gradle and wrapper filenames have
explicit mappings. Lookup is case insensitive, using native filename, extension
and language associations rather than wildcard hacks.

No requested major file type uses the default file glyph. TXT deliberately uses
the existing prose glyph. Unknown extensions, unknown dotfiles and unrecognized
extensionless files retain the generic fallback unless their language has a mapping.

Validation checks 94 representative filenames in both variants and 225
icon/background pairs per variant. Minimum tested icon contrast is 4.30:1 in
Light and 3.07:1 in Noir. All original glyph assets and current associations are
preserved for this release preparation.
