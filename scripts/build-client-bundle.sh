#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
BUILD_DIR="$ROOT/build/client-deployment"
BOOTSTRAP="$BUILD_DIR/packwiz-installer-bootstrap.jar"
BOOTSTRAP_URL="https://github.com/packwiz/packwiz-installer-bootstrap/releases/download/v0.0.3/packwiz-installer-bootstrap.jar"
EXPECTED_BOOTSTRAP_SHA256="a8fbb24dc604278e97f4688e82d3d91a318b98efc08d5dbfcbcbcab6443d116c"

cd "$ROOT"
packwiz refresh
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

PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')
packwiz serve --port "$PORT" >"$BUILD_DIR/packwiz-serve.log" 2>&1 &
SERVE_PID=$!
trap 'kill "$SERVE_PID" 2>/dev/null || true' EXIT INT TERM

READY=0
for _attempt in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS "http://127.0.0.1:$PORT/pack.toml" >/dev/null; then
    READY=1
    break
  fi
  sleep 1
done
if [ "$READY" -ne 1 ]; then
  echo "Local Packwiz server did not become ready" >&2
  exit 1
fi

INSTALL_OK=0
for _attempt in 1 2 3; do
  if (
    cd "$STAGE_DIR/.minecraft"
    java -jar packwiz-installer-bootstrap.jar \
      -g -s client "http://127.0.0.1:$PORT/pack.toml"
  ); then
    INSTALL_OK=1
    break
  fi
  echo "Client download attempt $_attempt failed; retrying..." >&2
done
if [ "$INSTALL_OK" -ne 1 ]; then
  echo "Packwiz Installer failed after three attempts" >&2
  exit 1
fi

rm -f "$ARCHIVE"
(
  cd "$STAGE_DIR"
  COPYFILE_DISABLE=1 zip -qr "$ARCHIVE" . \
    -x '*.DS_Store' '__MACOSX/*' '.minecraft/logs/*' \
    '.minecraft/crash-reports/*' '.minecraft/saves/*'
)

unzip -t "$ARCHIVE" >/dev/null
CHECKSUM=$(shasum -a 256 "$ARCHIVE" | awk '{print $1}')

echo "$ARCHIVE"
echo "SHA-256: $CHECKSUM"
