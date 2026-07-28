#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
BUILD_DIR="$ROOT/build/deployment"
STAGE_DIR="$BUILD_DIR/server-files"
BOOTSTRAP="$BUILD_DIR/packwiz-installer-bootstrap.jar"
BOOTSTRAP_URL="https://github.com/packwiz/packwiz-installer-bootstrap/releases/download/v0.0.3/packwiz-installer-bootstrap.jar"
EXPECTED_BOOTSTRAP_SHA256="a8fbb24dc604278e97f4688e82d3d91a318b98efc08d5dbfcbcbcab6443d116c"

cd "$ROOT"
./tools/packwiz refresh
./scripts/audit-pack.sh

mkdir -p "$BUILD_DIR"
if [ ! -f "$BOOTSTRAP" ]; then
  curl -fL "$BOOTSTRAP_URL" -o "$BOOTSTRAP"
fi

ACTUAL_SHA256=$(shasum -a 256 "$BOOTSTRAP" | awk '{print $1}')
if [ "$ACTUAL_SHA256" != "$EXPECTED_BOOTSTRAP_SHA256" ]; then
  echo "Unexpected packwiz installer bootstrap checksum" >&2
  exit 1
fi

rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR"

PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')
./tools/packwiz serve --port "$PORT" >"$BUILD_DIR/packwiz-serve.log" 2>&1 &
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

(
  cd "$STAGE_DIR"
  java -jar "$BOOTSTRAP" -g -s server "http://127.0.0.1:$PORT/pack.toml"
)

# The shared DH config is preserved on clients so Packwiz never replaces their
# personal rendering settings. Apply only the dedicated-server tuning here.
patch -d "$STAGE_DIR" -p0 <"$ROOT/server-overrides/DistantHorizons-server.patch"

VERSION=$(sed -n 's/^version = "\([^"]*\)"/\1/p' pack.toml)
BUNDLE="$BUILD_DIR/ambercraft-server-$VERSION.tar.gz"
CONTENTS="mods packwiz.json"
for path in config defaultconfigs kubejs; do
  if [ -e "$STAGE_DIR/$path" ]; then
    CONTENTS="$CONTENTS $path"
  fi
done
# CONTENTS contains only the fixed pack-managed paths above.
# shellcheck disable=SC2086
COPYFILE_DISABLE=1 tar --no-xattrs -C "$STAGE_DIR" -czf "$BUNDLE" $CONTENTS

echo "$BUNDLE"
