# Cross-machine development and testing

This repository is the single source of truth for Ambercraft. The Mac where
the pack is authored does not need to be the fastest Minecraft machine. The
CachyOS desktop is the client and local-load test machine, and the Pterodactyl
instance is the authoritative dedicated-server test machine.

## Roles

| System | Role | Persistent data |
| --- | --- | --- |
| This Mac | Edit Packwiz metadata, configs, KubeJS, and documentation | This repository |
| CachyOS desktop | Visual, gameplay, compatibility, and high-load client tests | A disposable Prism instance and test worlds |
| Pterodactyl host | Linux dedicated-server validation and multiplayer profiling | Test world, logs, spark reports, and backups |

Never edit the canonical `mods/`, `config/`, or `kubejs/` files inside a test
instance. Bring a discovered fix back to this repository, refresh the Packwiz
index here, and redistribute it. Test worlds and player data never belong in
this repository.

## Transport

Use a Git remote for the small, text-based Packwiz source. A private repository
is appropriate for authoring, although an unauthenticated HTTPS location is
needed if Packwiz Installer will update clients and Pterodactyl directly.

Until that URL exists, distribute the known-good client ZIP in `exports/` and
upload the generated server installation to Pterodactyl over SFTP. Do not use
the current `.mrpack`; mixed CurseForge and Modrinth export is recorded as
broken in `TESTING.md`.

The longer-term arrangement is:

1. Push a tested commit from this Mac.
2. Publish the Packwiz files at a stable HTTPS URL ending in `pack.toml`.
3. Let the Prism instance run Packwiz Installer in client mode before launch.
4. Let Pterodactyl run the same installer in server mode before Forge starts.
5. Tag releases only after both targets pass their gates.

Packwiz side metadata then produces the correct installation automatically:
visual/performance mods on the desktop, administration mods on Pterodactyl,
and shared content on both.

## Change cycle

On this Mac, after every change:

```sh
./tools/packwiz refresh
./scripts/audit-pack.sh
git diff --check
git diff
```

Give every candidate build a short identifier, ideally the Git commit ID. Do
not change several unrelated systems between tests; one bounded change makes a
failed comparison useful.

On the CachyOS desktop:

1. Synchronize the exact candidate into a dedicated Prism instance.
2. Launch once with a disposable local world for renderer and UI checks.
3. Join the Pterodactyl test server using the same candidate.
4. Preserve screenshots and `latest.log` when something is visually wrong.
5. Run `scripts/capture-test-report.sh <instance-directory>` from a clone of
   this repository and return the resulting report here.

On Pterodactyl:

1. Stop the server and take a world backup before changing the candidate.
2. Synchronize the server side of the exact same Packwiz candidate.
3. Start with a disposable world when world generation changed.
4. Run idle, pregenerated-travel, and fresh-generation tests separately.
5. Capture spark links and download `logs/latest.log` and crash reports.
6. Run the report script against the server directory when shell access is
   available. Otherwise download those files and run it locally.

## Performance comparison

Use three distinct five-minute spark profiles on the Pterodactyl host:

1. **Idle baseline:** one player stationary in an already generated area.
2. **Pregenerated travel:** one player moving quickly through existing chunks.
3. **Fresh exploration:** one player generating new terrain continuously.

Record player count, approximate activity, view distance, simulation distance,
and whether Chunky pregeneration was complete. A combined profile without this
context cannot reliably distinguish mob AI from world generation.

For multiplayer load, add players only after the three single-player profiles
are understood. The first useful progression is one, two, four, then the
expected maximum player count.

## Returning results to this task

The Codex task can remain on this Mac. For each remote test, return:

- candidate identifier or commit ID;
- machine (`CachyOS desktop` or `Pterodactyl`);
- what happened during the test;
- spark URL, if applicable;
- generated test report;
- relevant screenshot or crash report.

That is enough to continue diagnosis and make the next canonical change here.
Do not paste account tokens, Pterodactyl API keys, public IP addresses, or the
contents of `server.properties` into reports.
