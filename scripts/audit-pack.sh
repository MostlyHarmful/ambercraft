#!/bin/sh
set -eu

test -f pack.toml
test -f index.toml

metadata_count=$(find mods -maxdepth 1 -name '*.pw.toml' | wc -l | tr -d ' ')
indexed_mod_count=$(grep '^file = "mods/.*\.pw\.toml"$' index.toml | wc -l | tr -d ' ')
index_count=$(grep -c '^\[\[files\]\]' index.toml)

if [ "$metadata_count" -ne 108 ]; then
  echo "Expected 108 mod metadata files; found $metadata_count" >&2
  exit 1
fi

if [ "$indexed_mod_count" -ne "$metadata_count" ]; then
  echo "Index has $indexed_mod_count mod entries but mods/ has $metadata_count metadata files" >&2
  exit 1
fi

./tools/packwiz list >/dev/null
echo "Pack audit passed: $metadata_count mods, $index_count total indexed files."
