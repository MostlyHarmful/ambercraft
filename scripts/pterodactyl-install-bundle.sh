#!/bin/sh
set -eu

STAMP=$1
ARCHIVE=$2
SERVER_DIR=/home/container

cd "$SERVER_DIR"
mkdir -p backups

set --
for path in mods config defaultconfigs kubejs packwiz.json; do
  if [ -e "$path" ]; then
    set -- "$@" "$path"
  fi
done
if [ "$#" -gt 0 ]; then
  tar -czf "backups/ambercraft-pack-before-$STAMP.tar.gz" "$@"
fi

rm -rf "$SERVER_DIR/mods"
mkdir -p "$SERVER_DIR/mods"
tar -xzf "/ambercraft-transfer/$ARCHIVE" -C "$SERVER_DIR"

# macOS can attach AppleDouble metadata to archives. These files are never pack
# content and may otherwise be mistaken for JARs by Forge.
for path in mods config defaultconfigs kubejs; do
  if [ -d "$SERVER_DIR/$path" ]; then
    find "$SERVER_DIR/$path" -name '._*' -type f -delete
  fi
done

for path in mods config defaultconfigs kubejs packwiz.json backups; do
  if [ -e "$SERVER_DIR/$path" ]; then
    chown -R 1000:1000 "$SERVER_DIR/$path"
  fi
done
