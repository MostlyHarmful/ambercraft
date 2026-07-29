#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
BUILD_DIR="$ROOT/build/client-deployment"
BOOTSTRAP="$BUILD_DIR/packwiz-installer-bootstrap.jar"
BOOTSTRAP_URL="https://github.com/packwiz/packwiz-installer-bootstrap/releases/download/v0.0.3/packwiz-installer-bootstrap.jar"
EXPECTED_BOOTSTRAP_SHA256="a8fbb24dc604278e97f4688e82d3d91a318b98efc08d5dbfcbcbcab6443d116c"

cd "$ROOT"
./tools/packwiz refresh
./scripts/audit-pack.sh

VERSION=$(sed -n 's/^version = "\([^"]*\)"/\1/p' pack.toml)
if [ -z "$VERSION" ]; then
  echo "Could not read the pack version from pack.toml" >&2
  exit 1
fi

STAGE_DIR="$BUILD_DIR/Ambercraft-$VERSION"
ARCHIVE="$ROOT/exports/Ambercraft-$VERSION-Prism.zip"

mkdir -p "$BUILD_DIR" "$ROOT/exports"
if [ ! -f "$BOOTSTRAP" ]; then
  curl -fL "$BOOTSTRAP_URL" -o "$BOOTSTRAP"
fi

ACTUAL_SHA256=$(shasum -a 256 "$BOOTSTRAP" | awk '{print $1}')
if [ "$ACTUAL_SHA256" != "$EXPECTED_BOOTSTRAP_SHA256" ]; then
  echo "Unexpected Packwiz installer bootstrap checksum" >&2
  exit 1
fi

rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR/.minecraft"
cp client-instance/instance.cfg "$STAGE_DIR/instance.cfg"
cp client-instance/mmc-pack.json "$STAGE_DIR/mmc-pack.json"
cp "$BOOTSTRAP" "$STAGE_DIR/.minecraft/packwiz-installer-bootstrap.jar"

# Keep the imported Prism instance label synchronized with pack.toml.
sed -i.bak \
  -e "s/^name=Ambercraft .*/name=Ambercraft $VERSION/" \
  -e "s|^notes=.*|notes=Ambercraft $VERSION. Use Java 17 with G1; Packwiz synchronizes managed files before launch.|" \
  "$STAGE_DIR/instance.cfg"
rm "$STAGE_DIR/instance.cfg.bak"

rm -f "$ARCHIVE"
(
  cd "$STAGE_DIR"
  COPYFILE_DISABLE=1 zip -qr "$ARCHIVE" . \
    -x '*.DS_Store' '__MACOSX/*' '.minecraft/logs/*' \
    '.minecraft/crash-reports/*' '.minecraft/saves/*'
)

unzip -t "$ARCHIVE" >/dev/null
unzip -p "$ARCHIVE" instance.cfg | grep -F \
  'https://raw.githubusercontent.com/amberuhls/ambercraft/main/pack.toml' \
  >/dev/null
unzip -l "$ARCHIVE" | grep -F \
  '.minecraft/packwiz-installer-bootstrap.jar' >/dev/null
CHECKSUM=$(shasum -a 256 "$ARCHIVE" | awk '{print $1}')

echo "$ARCHIVE"
echo "SHA-256: $CHECKSUM"
