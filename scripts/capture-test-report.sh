#!/bin/sh
set -eu

INSTANCE_DIR=${1:-.}
STAMP=$(date -u '+%Y%m%dT%H%M%SZ')
OUTPUT=${2:-"ambercraft-test-$STAMP.txt"}

if [ ! -d "$INSTANCE_DIR" ]; then
  echo "Instance directory does not exist: $INSTANCE_DIR" >&2
  exit 1
fi

{
  echo "Ambercraft test report"
  echo "Captured (UTC): $STAMP"
  echo "Instance: $INSTANCE_DIR"
  echo

  echo "== Candidate =="
  if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git rev-parse --verify HEAD 2>/dev/null || echo "No committed candidate yet"
    git status --short 2>/dev/null || true
  else
    echo "Git candidate unavailable"
  fi
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum pack.toml index.toml 2>/dev/null || true
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 pack.toml index.toml 2>/dev/null || true
  fi
  echo

  echo "== Host =="
  uname -a 2>/dev/null || true
  java -version 2>&1 || true
  if command -v lscpu >/dev/null 2>&1; then
    lscpu | sed -n '/Model name:/p;/^CPU(s):/p;/Thread(s) per core:/p;/Core(s) per socket:/p'
  elif command -v sysctl >/dev/null 2>&1; then
    sysctl -n machdep.cpu.brand_string 2>/dev/null || true
    sysctl -n hw.logicalcpu 2>/dev/null || true
  fi
  if command -v free >/dev/null 2>&1; then
    free -h
  fi
  df -h "$INSTANCE_DIR" 2>/dev/null || true
  echo

  LOG="$INSTANCE_DIR/logs/latest.log"
  echo "== Minecraft summary =="
  if [ -f "$LOG" ]; then
    grep -E "Done \(|Can't keep up|joined the game|left the game|lost connection|Watchdog|spark\.lucko\.me" "$LOG" | tail -n 120 || true
  else
    echo "No logs/latest.log found"
  fi
  echo

  echo "== Recent warnings and errors =="
  if [ -f "$LOG" ]; then
    grep -E "/(WARN|ERROR)\]" "$LOG" | tail -n 160 || true
  fi
} > "$OUTPUT"

echo "Wrote $OUTPUT"
