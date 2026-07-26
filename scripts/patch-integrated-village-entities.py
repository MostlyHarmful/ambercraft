#!/usr/bin/env python3
"""Replace unavailable Integrated Villages priests with vanilla villagers."""

from __future__ import annotations

import gzip
import sys
import zipfile
from pathlib import Path


PREFIX = "data/integrated_villages/structures/"
SOURCE_ID = b"irons_spellbooks:priest"
REPLACEMENT_ID = b"minecraft:villager"
EXPECTED_COUNT = 7


def main() -> int:
    if len(sys.argv) != 3:
        print(
            "usage: patch-integrated-village-entities.py "
            "<integrated-villages.jar> <pack-root>",
            file=sys.stderr,
        )
        return 2

    jar_path = Path(sys.argv[1])
    pack_root = Path(sys.argv[2])
    output_root = pack_root / "kubejs"

    patched_count = 0
    with zipfile.ZipFile(jar_path) as jar:
        for name in jar.namelist():
            if not (name.startswith(PREFIX) and name.endswith(".nbt")):
                continue

            compressed = jar.read(name)
            payload = gzip.decompress(compressed)
            source = len(SOURCE_ID).to_bytes(2, "big") + SOURCE_ID
            replacement = len(REPLACEMENT_ID).to_bytes(2, "big") + REPLACEMENT_ID
            occurrences = payload.count(source)
            if not occurrences:
                continue
            payload = payload.replace(source, replacement)
            patched_count += occurrences

            output_path = output_root / name
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(gzip.compress(payload, mtime=0))
            print(output_path.relative_to(pack_root))

    if patched_count != EXPECTED_COUNT:
        raise RuntimeError(
            f"expected {EXPECTED_COUNT} {SOURCE_ID.decode()} entities, "
            f"patched {patched_count}"
        )

    print(f"Patched {patched_count} {SOURCE_ID.decode()} entities.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
