#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
HOST=${AMBERCRAFT_SSH_HOST:-amber}
CONTAINER=${AMBERCRAFT_CONTAINER_ID:-5b2cb185-1a2b-4670-9d0c-111f6697ce7b}
BUNDLE=${1:-}

if [ -z "$BUNDLE" ]; then
  VERSION=$(sed -n 's/^version = "\([^"]*\)"/\1/p' "$ROOT/pack.toml")
  BUNDLE="$ROOT/build/deployment/ambercraft-server-$VERSION.tar.gz"
fi

if [ ! -f "$BUNDLE" ]; then
  echo "Bundle not found: $BUNDLE" >&2
  echo "Run scripts/build-server-bundle.sh first." >&2
  exit 1
fi

STATE=$(ssh "$HOST" "docker inspect -f '{{.State.Status}}' '$CONTAINER'")
if [ "$STATE" != "exited" ] && [ "$STATE" != "created" ]; then
  echo "Ambercraft must be stopped in Pterodactyl before deployment (state: $STATE)." >&2
  exit 1
fi

STAMP=$(date -u '+%Y%m%dT%H%M%SZ')
REMOTE_BUNDLE="/tmp/ambercraft-server-$STAMP.tar.gz"
REMOTE_NAME=$(basename "$REMOTE_BUNDLE")
scp "$BUNDLE" "$HOST:$REMOTE_BUNDLE"

ssh "$HOST" "docker run --rm -i --user 0:0 --volumes-from '$CONTAINER' -v /tmp:/ambercraft-transfer --entrypoint /bin/sh ghcr.io/pterodactyl/yolks:java_21 -s -- '$STAMP' '$REMOTE_NAME'" \
  < "$ROOT/scripts/pterodactyl-install-bundle.sh"

ssh "$HOST" "rm -f '$REMOTE_BUNDLE'"
echo "Deployed $(basename "$BUNDLE") to Ambercraft. Start it from Pterodactyl when ready."
