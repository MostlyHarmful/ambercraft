# Ambercraft

A Forge 1.20.1 vanilla-plus exploration and adventure pack managed with
[packwiz](https://packwiz.infra.link/). The pack currently targets Forge
47.4.10 and contains 81 Packwiz-managed mod entries. The install index also
ships Ambercraft's configuration, compatibility overrides, and campaign data.

Mod selection and configuration are governed by [`DESIGN.md`](DESIGN.md). Read
that brief before adding another content system or designing progression.
The staged End Remastered campaign draft lives in
[`PROGRESSION.md`](PROGRESSION.md).

## Repository layout

- `pack.toml`: pack identity and Minecraft/Forge versions.
- `index.toml`: generated install index. Commit this file.
- `mods/*.pw.toml`: exact mod versions, download hashes, update metadata, and
  client/server side rules.
- `desired-mods.txt`: the human-readable design list used to audit the pack.
- `DESIGN.md`: the pack's experience goals and acceptance criteria.
- `PROGRESSION.md`: the staged campaign and KubeJS implementation outline.
- `TESTING.md`: verified launch status, known warnings, and the release test
  matrix.
- `WORKFLOW.md`: cross-machine handoff between pack authoring, the CachyOS
  client test machine, and Pterodactyl.
- `tools/packwiz`: local packwiz binary (ignored by Git).

## Routine commands

Run commands from this directory:

```sh
./tools/packwiz refresh
./tools/packwiz list
./tools/packwiz update --all
```

After changing configuration or adding/removing a mod, always run
`./tools/packwiz refresh` and review the Git diff before distributing the pack.
Updates should be tested against a copy of the world before deployment.

To add a mod, prefer an exact project URL when names are ambiguous:

```sh
./tools/packwiz modrinth add 'https://modrinth.com/mod/example'
./tools/packwiz curseforge add 'https://www.curseforge.com/minecraft/mc-mods/example'
```

## Client and server deployment

The canonical distribution is `pack.toml`, `index.toml`, the metadata files,
and any future `config/`, `defaultconfigs/`, `kubejs/`, or resource files. A
packwiz-compatible launcher can install the client directly from a hosted
`pack.toml` URL. For launchers without native packwiz support, export a pack:

```sh
mkdir -p exports
./tools/packwiz modrinth export --restrictDomains=false \
  -o exports/ambercraft-0.1.1.mrpack
```

Mixed Modrinth/CurseForge exports can be slow because packwiz must contact both
services. A failed or interrupted export must not be distributed.

For a server, install Java 21 and Forge 47.4.10, then use packwiz-installer with
the hosted `pack.toml` URL. This exact combination has passed the repository's
initial dedicated-server smoke test. Client-only entries are excluded
automatically.
Keep the server world, `server.properties`, whitelist, and operator files
outside the pack repository.

The current private-repository deployment path builds a filtered server bundle
and copies it into the stopped Ambercraft Pterodactyl container:

```sh
./scripts/build-server-bundle.sh
./scripts/deploy-pterodactyl.sh
```

Deployment also reapplies Ambercraft's tested Pterodactyl runtime profile:
`-Xms1G -Xmx6G -XX:+UseG1GC`, modded flight enabled, spawn protection disabled,
and a two-minute watchdog. The stock Forge egg does not read
`user_jvm_args.txt`, so the deployment script writes these JVM flags into the
Forge argument file that the egg actually launches.

## Side rules

The following are intentionally client-only: AmbientSounds, AppleSkin,
Embeddium, Embeddium Extra, Sodium/Embeddium Dynamic Lights
and its Options API, Entity Culling, ImmediatelyFast, JEI, Mouse Tweaks,
Oculus, and Sound Physics Remastered. Distant Horizons and both Xaero maps run
on both sides for server-backed LOD delivery and stable world identity. Spark
is server-only. Jade is installed on both sides so its server-backed block data
remains available. Athena is on both
sides because Chipped uses it for connected-texture/block behavior.

## World-generation cautions

The world-generation stack is deliberate: Terralith supplies Overworld biomes,
Tectonic reshapes terrain, Incendium enriches the Nether, and Nullscape plus
End's Phantasm make the End a substantial final expedition. Integrated Villages
replaces villages, while Integrated Stronghold, IDAS, and the YUNG suite add or
replace other structures. Do not add or remove any of these after
players begin exploring without first testing a world copy.

Quark's climate-control module ignores humidity only. This increases the range
of Terralith biomes eligible within a temperature region while preserving warm
versus cold climates and Tectonic's terrain parameters.

Mowzie's Mobs is the pack's focused added-boss layer. Its encounters should be
used as optional or alternate End Remastered routes through crafted eye
components, not as a mandatory boss rush. Do not add another broad boss suite
until these encounters have been tested for tone, difficulty, and reward power.
LootJS is included as server-side pack infrastructure for narrowly injecting
clues and progression components without replacing complete mod loot tables.

Before opening the server publicly:

1. Create a fresh test world and confirm spawn, villages, strongholds, Nether
   fortresses, and several Terralith biomes generate normally.
2. Confirm End Remastered eyes lead to an Integrated Stronghold and that the
   portal can be completed.
3. Finalize worldgen and season settings.
4. Use Distant Horizons' `/dh pregen` for the intended launch area only after
   those checks. Do not run Chunky concurrently; DH 3.2 removed the hard block
   but its queue can still develop missing LODs when Chunky outruns it.
5. Back up the world, then begin the permanent world.

See [`TESTING.md`](TESTING.md) for the current results and unresolved warnings.
See [`WORKFLOW.md`](WORKFLOW.md) before moving a candidate between machines.

Create 6 is the most compatibility-sensitive content mod in the list. Treat
Create, Copycats+, and Steam 'n' Rails as one version-locked group when updating.
KubeJS Create is intentionally absent until Ambercraft uses Create-specific
scripted recipes; ordinary custom recipes continue to use base KubeJS.
