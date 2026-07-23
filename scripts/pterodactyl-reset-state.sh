#!/bin/sh
set -eu

STAMP=$1
SERVER_DIR=/home/container
BACKUP_DIR="$SERVER_DIR/backups/ambercraft-reset-$STAMP"

mkdir -p "$BACKUP_DIR"
for path in world config defaultconfigs kubejs moonlight-global-datapacks packwiz.json; do
  if [ -e "$SERVER_DIR/$path" ]; then
    mv "$SERVER_DIR/$path" "$BACKUP_DIR/$path"
  fi
done

for path in ._config ._defaultconfigs ._kubejs ._mods ._packwiz.json; do
  if [ -e "$SERVER_DIR/$path" ]; then
    rm -rf "$SERVER_DIR/$path"
  fi
done

chown -R 1000:1000 "$BACKUP_DIR"
echo "$BACKUP_DIR"
