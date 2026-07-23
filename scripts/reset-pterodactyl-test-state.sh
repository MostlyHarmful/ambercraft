#!/bin/sh
set -eu

if [ "${1:-}" != "--confirm" ]; then
  echo "This quarantines Ambercraft's world and generated pack state." >&2
  echo "Re-run with --confirm after stopping the server in Pterodactyl." >&2
  exit 2
fi

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
HOST=${AMBERCRAFT_SSH_HOST:-amber}
CONTAINER=${AMBERCRAFT_CONTAINER_ID:-5b2cb185-1a2b-4670-9d0c-111f6697ce7b}
STATE=$(ssh "$HOST" "docker inspect -f '{{.State.Status}}' '$CONTAINER'")

if [ "$STATE" != "exited" ] && [ "$STATE" != "created" ]; then
  echo "Ambercraft must be stopped in Pterodactyl before reset (state: $STATE)." >&2
  exit 1
fi

STAMP=$(date -u '+%Y%m%dT%H%M%SZ')
ssh "$HOST" "docker run --rm -i --user 0:0 --volumes-from '$CONTAINER' --entrypoint /bin/sh ghcr.io/pterodactyl/yolks:java_21 -s -- '$STAMP'" \
  < "$ROOT/scripts/pterodactyl-reset-state.sh"

echo "Old test state quarantined. Redeploy Ambercraft before starting the server."
