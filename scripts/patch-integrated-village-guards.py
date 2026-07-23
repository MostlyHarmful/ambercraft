#!/usr/bin/env python3
"""Replace optional Integrated Villages entities with vanilla equivalents."""

from __future__ import annotations

import gzip
import struct
import sys
import zipfile
from pathlib import Path


PREFIX = "data/integrated_villages/structures/"
REPLACEMENTS = {
    b"guardvillagers:guard": b"minecraft:iron_golem",
    b"irons_spellbooks:priest": b"minecraft:villager",
}
EXPECTED_COUNTS = {
    b"guardvillagers:guard": 12,
    b"irons_spellbooks:priest": 7,
}
HEALTH_20 = b"\x05\x00\x06Health" + struct.pack(">f", 20.0)
HEALTH_100 = b"\x05\x00\x06Health" + struct.pack(">f", 100.0)


def main() -> int:
    if len(sys.argv) != 3:
        print(
            "usage: patch-integrated-village-guards.py "
            "<integrated-villages.jar> <pack-root>",
            file=sys.stderr,
        )
        return 2

    jar_path = Path(sys.argv[1])
    pack_root = Path(sys.argv[2])
    output_root = pack_root / "kubejs"

    patched_counts = {source_id: 0 for source_id in REPLACEMENTS}
    with zipfile.ZipFile(jar_path) as jar:
        for name in jar.namelist():
            if not (name.startswith(PREFIX) and name.endswith(".nbt")):
                continue

            compressed = jar.read(name)
            payload = gzip.decompress(compressed)
            changed = False
            for source_id, replacement_id in REPLACEMENTS.items():
                source = struct.pack(">H", len(source_id)) + source_id
                replacement = (
                    struct.pack(">H", len(replacement_id)) + replacement_id
                )
                occurrences = payload.count(source)
                if occurrences:
                    payload = payload.replace(source, replacement)
                    if source_id == b"guardvillagers:guard":
                        health_occurrences = payload.count(HEALTH_20)
                        if health_occurrences != occurrences:
                            raise RuntimeError(
                                f"{name}: expected {occurrences} guard health "
                                f"tags, found {health_occurrences}"
                            )
                        payload = payload.replace(HEALTH_20, HEALTH_100)
                    patched_counts[source_id] += occurrences
                    changed = True

            if not changed:
                continue

            output_path = output_root / name
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(gzip.compress(payload, mtime=0))
            print(output_path.relative_to(pack_root))

    if patched_counts != EXPECTED_COUNTS:
        raise RuntimeError(
            f"expected {EXPECTED_COUNTS!r}, patched {patched_counts!r}"
        )

    print(
        "Patched "
        + ", ".join(
            f"{count} {source_id.decode()}"
            for source_id, count in patched_counts.items()
        )
        + " templates."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
