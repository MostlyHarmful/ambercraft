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

# Pack-managed code and defaults must exactly match the canonical bundle.
# Overlaying these directories leaves removed scripts and recipes active.
rm -rf "$SERVER_DIR/mods" "$SERVER_DIR/kubejs" "$SERVER_DIR/defaultconfigs"
mkdir -p "$SERVER_DIR/mods"
tar -xzf "$TRANSFER_DIR/$ARCHIVE" -C "$SERVER_DIR"

# Retain only the five newest pack-only deployment snapshots. Full world
# backups use different names and are never touched by this retention pass.
find "$SERVER_DIR/backups" -maxdepth 1 -type f -name 'ambercraft-pack-before-*.tar.gz' -print \
  | sort -r \
  | awk 'NR > 5' \
  | while IFS= read -r old_backup; do
      rm -f -- "$old_backup"
    done

# Remove known leftovers from mods and one-off troubleshooting profiles that
# are no longer part of Ambercraft. Active generated configs remain intact.
rm -rf \
  "$SERVER_DIR/config/bettercaravans-common.toml" \
  "$SERVER_DIR/config/betterdays-common.toml" \
  "$SERVER_DIR/config/maplink" \
  "$SERVER_DIR/config/zombieawareness" \
  "$SERVER_DIR/config/DistantHorizons-rapid.toml.disabled" \
  "$SERVER_DIR/config/spark/tmp"

# Forge copies default server configs when it creates a world, but this pack is
# also deployed onto retained test worlds. Seed Ambercraft's managed backpack
# limits once when that world has no Sophisticated Backpacks config yet. Forge
# fills the remaining upstream defaults on first launch and preserves the
# resulting complete file on later deployments.
BACKPACK_DEFAULT="$SERVER_DIR/defaultconfigs/sophisticatedbackpacks-server.toml"
BACKPACK_WORLD_CONFIG="$SERVER_DIR/world/serverconfig/sophisticatedbackpacks-server.toml"
if [ -f "$BACKPACK_DEFAULT" ] && [ -d "$SERVER_DIR/world" ] && [ ! -f "$BACKPACK_WORLD_CONFIG" ]; then
  mkdir -p "$SERVER_DIR/world/serverconfig"
  cp "$BACKPACK_DEFAULT" "$BACKPACK_WORLD_CONFIG"
fi
if [ -f "$BACKPACK_WORLD_CONFIG" ]; then
  sed -i \
    -e 's/^[[:space:]]*tooManyBackpacksSlowness = .*/\t\ttooManyBackpacksSlowness = true/' \
    -e 's/^[[:space:]]*maxNumberOfBackpacks = .*/\t\tmaxNumberOfBackpacks = 1/' \
    -e 's/^[[:space:]]*slownessLevelsPerAdditionalBackpack = .*/\t\tslownessLevelsPerAdditionalBackpack = 1.0/' \
    -e 's/^[[:space:]]*onlyWornBackpackTriggersUpgrades = .*/\t\tonlyWornBackpackTriggersUpgrades = true/' \
    "$BACKPACK_WORLD_CONFIG"
fi

# Sophisticated Storage was added after the live world was created. Seed its
# stationary-storage limits once; Forge will fill any omitted upstream options.
STORAGE_DEFAULT="$SERVER_DIR/defaultconfigs/sophisticatedstorage-server.toml"
STORAGE_WORLD_CONFIG="$SERVER_DIR/world/serverconfig/sophisticatedstorage-server.toml"
if [ -f "$STORAGE_DEFAULT" ] && [ -d "$SERVER_DIR/world" ] && [ ! -f "$STORAGE_WORLD_CONFIG" ]; then
  mkdir -p "$SERVER_DIR/world/serverconfig"
  cp "$STORAGE_DEFAULT" "$STORAGE_WORLD_CONFIG"
fi

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
  echo "-Xmx10G"
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
set_property difficulty hard
set_property spawn-protection 0
set_property max-tick-time 120000
set_property view-distance 8
set_property simulation-distance 6
set_property function-permission-level 4
set_property motd Ambercraft

for path in mods config defaultconfigs kubejs packwiz.json backups server.properties libraries/net/minecraftforge/forge/1.20.1-47.4.10/unix_args.txt; do
  if [ -n "$AMBERCRAFT_OWNER" ] && [ -e "$SERVER_DIR/$path" ]; then
    chown -R "$AMBERCRAFT_OWNER" "$SERVER_DIR/$path"
  fi
done
