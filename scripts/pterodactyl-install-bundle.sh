#!/bin/sh
set -eu

STAMP=$1
ARCHIVE=$2
SERVER_DIR=${SERVER_DIR:-/home/container}
TRANSFER_DIR=${TRANSFER_DIR:-/ambercraft-transfer}
AMBERCRAFT_OWNER=${AMBERCRAFT_OWNER-1000:1000}

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
tar -xzf "$TRANSFER_DIR/$ARCHIVE" -C "$SERVER_DIR"

# macOS can attach AppleDouble metadata to archives. These files are never pack
# content and may otherwise be mistaken for JARs by Forge.
for path in mods config defaultconfigs kubejs; do
  if [ -d "$SERVER_DIR/$path" ]; then
    find "$SERVER_DIR/$path" -name '._*' -type f -delete
  fi
done

# Pterodactyl's stock Forge command launches @unix_args.txt directly and does
# not read Forge's user_jvm_args.txt. Put Ambercraft's bounded heap and
# collector flags into the argument file that is actually used. These later
# flags override the egg's generic -Xms128M and MaxRAMPercentage settings.
FORGE_ARGS="$SERVER_DIR/libraries/net/minecraftforge/forge/1.20.1-47.4.10/unix_args.txt"
if [ ! -f "$FORGE_ARGS" ]; then
  echo "Forge argument file not found: $FORGE_ARGS" >&2
  exit 1
fi

JVM_TMP="$FORGE_ARGS.ambercraft"
{
  echo "-Xms1G"
  echo "-Xmx6G"
  echo "-XX:+UseG1GC"
  grep -v -E '^-Xms|^-Xmx|^-XX:\+Use(G1GC|ZGC)|^-XX:\+ZGenerational$' "$FORGE_ARGS"
} > "$JVM_TMP"
mv "$JVM_TMP" "$FORGE_ARGS"

# Preserve ordinary Pterodactyl settings while applying the small set of
# server properties that Ambercraft relies on for a friendly modded SMP.
PROPERTIES="$SERVER_DIR/server.properties"
touch "$PROPERTIES"
set_property() {
  key=$1
  value=$2
  property_tmp="$PROPERTIES.ambercraft"
  awk -F= -v key="$key" -v value="$value" '
    BEGIN { replaced = 0 }
    $1 == key {
      if (!replaced) print key "=" value
      replaced = 1
      next
    }
    { print }
    END {
      if (!replaced) print key "=" value
    }
  ' "$PROPERTIES" > "$property_tmp"
  mv "$property_tmp" "$PROPERTIES"
}

set_property allow-flight true
set_property spawn-protection 0
set_property max-tick-time 120000
set_property motd Ambercraft

for path in mods config defaultconfigs kubejs packwiz.json backups server.properties libraries/net/minecraftforge/forge/1.20.1-47.4.10/unix_args.txt; do
  if [ -n "$AMBERCRAFT_OWNER" ] && [ -e "$SERVER_DIR/$path" ]; then
    chown -R "$AMBERCRAFT_OWNER" "$SERVER_DIR/$path"
  fi
done
