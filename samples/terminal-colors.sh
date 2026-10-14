#!/bin/sh
# Run: sh samples/terminal-colors.sh (no external commands or side effects).
printf '\nObsidian Celluloid · ANSI foreground / background inspection\n\n'
for code in 30 31 32 33 34 35 36 37 90 91 92 93 94 95 96 97; do
  printf '\033[%sm  ANSI %s · Frame 24 / 35mm\033[0m\n' "$code" "$code"
done
printf '\nBackground colors with explicit contrasting text:\n'
for code in 40 41 42 43 44 45 46 47 100 101 102 103 104 105 106 107; do
  printf '\033[%s;97m  ANSI %s  \033[0m  \033[%s;30m  ANSI %s  \033[0m\n' "$code" "$code" "$code" "$code"
done
printf '\n\033[1;31mREC\033[0m · \033[34mRaster ready\033[0m · \033[32mPASS\033[0m\n'
