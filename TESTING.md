# Test status

This file records what has actually been verified. A mod appearing in the pack
or reaching the title screen is not sufficient evidence that its gameplay works.

## Verified baseline — 2026-07-22

- Platform: macOS arm64
- Java: Oracle Java 21.0.12
- Minecraft: 1.20.1
- Forge: 47.4.10
- Pack metadata: 81 resolved mod entries and 220 indexed files after the
  release-one audit, campaign pass, replacement of Chunky with Oculus, and
  addition of Elytra Slot with Caelus
- Dedicated server: reached `Done (88.506s)` on its first fresh-world launch
  and `Done (25.621s)` on the post-override restart; after adding Mowzie's Mobs
  1.8.2 it reached `Done (17.455s)`. The progression-prototype validation
  reached `Done (15.052s)` and shut down cleanly.
- Shutdown: clean save of Overworld, Nether, and End
- Side filtering: packwiz-installer omitted client-only entries from the server
- KubeJS: completed its server resource reload

This proves that the current server subset and Java version can complete a
basic launch. It does not yet prove that a client can join or that all generated
structures and gameplay systems behave correctly.

## Known issues

### Pterodactyl Generational ZGC — rejected for the server

The first Pterodactyl multiplayer launch reached `Done` and accepted a player,
then the Linux memory-cgroup OOM killer terminated Java at essentially the full
8.4 GiB container limit. The JVM had been given a 7 GiB maximum heap, leaving
insufficient native/container headroom. A second clean-world test at `-Xmx6G`
reached roughly 7.8 GiB total container use and took 543 seconds to prepare
spawn. It did eventually complete and honor the queued stop cleanly, proving it
was slow rather than deadlocked. Use `-Xms1G -Xmx6G -XX:+UseG1GC` for the next
server test. Generational ZGC remains appropriate for the better-provisioned
Distant Horizons client. The original failure was a host-enforced OOM kill, not
a Java exception or mod crash.

The final deployment workflow now enforces `-Xms1G -Xmx6G -XX:+UseG1GC`
through Forge's active `unix_args.txt`. It also sets `allow-flight=true` for
modded movement, `spawn-protection=0` for a collaborative shared spawn, and
`max-tick-time=120000` so one unusually heavy generation tick does not trigger
the vanilla one-minute watchdog. Verify the effective JVM flags after the first
Pterodactyl launch.

### Ecological overlap and broken hollow-log placement — configured

Quark's hollow-log module is disabled after its fallen hollow logs generated
detached on ocean surfaces in the CachyOS visual test. Quark's crab is disabled
in favor of the Friends & Foes crab, avoiding two nearly equivalent beach mobs.
Alex's Mobs fly spawn weight is reduced from three to one so maggots remain
naturally obtainable. The automatic Animal Dictionary handout is disabled.
Confirm all changes in a fresh world; existing entities, generated blocks, and
already-issued books are not removed retroactively.

### IDAS optional integrations — resolved

IDAS 1.13.0 contains data for structures that require optional mods we have
deliberately not selected. The first launch logged invalid loot or spawner data
for content associated with Ars Nouveau and Ice and Fire, including the
Archmage's Tower and Dread Citadel.

Do not add Ars Nouveau or Ice and Fire merely to satisfy these structures. They
would introduce major magic and creature systems that do not fit the pack's
current scope. The files under `kubejs/data/idas/` now disable the two
optional-only structures and provide inert definitions for optional variants
that Minecraft otherwise attempts to parse.

The post-override restart reached `Done (25.621s)` without either of the prior
IDAS loot-table or Integrated API spawner errors.

### Guard Villagers — removed pending a stable build

Guard Villagers 1.6.18 repeatedly rewrote its generated common config every two
seconds on both the client and dedicated server. During the first real client
join, the server also accumulated severe tick delays and ultimately triggered
the 60-second watchdog while waiting for chunk generation. The crash report did
not attribute the stall directly to Guard Villagers, but the continuous config
rewrite is unacceptable independently. The mod is removed for the next A/B
test; village defense can be reconsidered only with a version that leaves its
configuration stable.

### Just Enough Resources — removed

JER failed while collecting an Integrated Villages cartographer trade, adding a
null-pointer warning and extra JEI initialization work. Its world-generation
catalogue also works against the pack's discovery-first design and is less
trustworthy with the heavily modified terrain stack. JEI remains installed;
only JER's generated resource, drop, and trade catalogue was removed.

### IDAS optional integrations — client warning remains

The inert IDAS overrides continue to eliminate the optional Ars Nouveau and Ice
and Fire errors on the dedicated server. A multiplayer client data reload still
parses several bundled IDAS optional loot tables before the server-side KubeJS
override layer is applied, producing absent-item warnings for disabled
structures. These are client-only reload warnings and do not enable or generate
the optional structures. Do not add the absent content mods merely to silence
them, and do not patch the IDAS jar; recheck this behavior when IDAS is updated.

### Structure tag warnings — resolved

Integrated Villages references an absent `integrated_villages:swamp_village`
structure from its `minecraft:village` tag. This also invalidates two
Supplementaries destination tags that depend on `#minecraft:village`. IDAS
additionally logs four absent Biomes O' Plenty and Oh The Biomes We've Gone
biome references. Narrow datapack overrides now remove the nonexistent village,
preserve the five vanilla village types and every real Integrated Village, and
redirect the absent optional-biome aliases to the inaccessible Void biome. The
final validation emitted none of the previous village or IDAS tag warnings.

### Integrated progression — data validation passed

LootJS 2.13.1 and the Ambercraft KubeJS scripts now connect Integrated
Villages, IDAS, YUNG structures, Alex's Caves, Mowzie's Mobs, vanilla bosses,
and End Remastered. KubeJS loaded the server script with zero errors and zero
warnings, accepted all three custom recipes with zero failures, and completed
the server resource reload. The full route table is recorded in
`PROGRESSION.md`.

Gameplay is not yet verified. End Remastered's default acquisition routes are
now disabled; Ambercraft supplies all sixteen routes. The Expedition Ledger,
global discovery record, Lootr chest behavior, boss difficulty, and clue
readability still require multiplayer testing.

Ambercraft 0.2.0 additionally references Artifacts' own themed loot pools from
eight signature modded treasure tables. A fresh exact-bundle server loaded the
KubeJS script with zero errors and zero warnings, registered five custom
recipes with zero failures, completed its server resource reload, and reached
`Done (103.184s)`. No loot-table parse or modifier error was emitted. This
validates the nested table references and their custom Artifacts rarity
condition at load time; actual per-player frequency and whether the resulting
items feel exciting without becoming common still require play.

The 0.2.0 test terminal's console reader hit a macOS `stty` spawn-helper error
when the automated harness attempted to send `stop`, after the server had
already reached `Done`. The disposable process was then terminated through its
PTY. This is a local test-harness cleanup failure rather than a Forge, worldgen,
or pack startup failure, but this particular run does not count as a verified
clean shutdown.

### Farmer's Delight integration

Farmer's Delight 1.3.2 is paired with Create Slice & Dice 3.6.0, Alex's Delight
1.5, and Cave Delight 2.0.1. Farmer's Delight already supplies
Serene Seasons crop tags and recognizes Quark and Supplementaries ropes.
Integrated Villages contains a native Farmer's Delight shop structure.

Ambercraft adds restrained farmhouse crop rolls, one IDAS inn meal roll, a
Quark blaze-lantern heat-source tag, and a cutting-board route from rotten
tomatoes to occasional Alex's Mobs maggots. Quark Delight was inspected and
rejected because it assumes Quark's intentionally disabled duplicate crab
module and would leave dead crab recipes.

Verify all four installed mods load without recipe errors, Slice & Dice
automates cutting/cooking, seasonal tooltips appear on the four core crops,
Integrated Village farmhouse loot remains modest under Lootr, and the spoiled
tomato recipe yields seeds with only an occasional maggot.

Alex's Caves Delight 1.0.27-final was rejected during the first smoke test
because it references Farmer's Delight's removed `ShepherdsPieBlock` class and
crashes against Farmer's Delight 1.3.2.

The replacement exact bundle completed Forge construction and server-data
reload on Java 21. Cave Delight, Alex's Delight, Farmer's Delight, Kotlin for
Forge, and Slice & Dice all initialized. End's Phantasm automatically enabled
its own Farmer's Delight compatibility data pack. KubeJS found 9,094 recipes,
added six Ambercraft recipes, removed three End Remastered defaults, and
reported zero failed recipes. Slice & Dice then injected its generated
automation recipes.

The audit also found and corrected three upstream data defects: two Cave
Delight recipes referenced items absent from the installed Alex's Caves build,
and Alex's Delight's barbecue recipe used its obsolete `amfd` namespace. The
impossible Cave Delight recipes are disabled by narrow data overrides, and the
barbecue recipe now uses `alexsdelight:cooked_loose_moose_rib`. The remaining
Incendium elytra smithing fallback is the pre-existing known warning.

The sandboxed macOS smoke runtime cannot open a listening socket, so it stopped
after successful recipe/data validation when binding port 25565. A complete
`Done` and clean shutdown must still be confirmed on Pterodactyl.

### Immersive Weathering Tweaks and Quantified API — removed

Immersive Weathering Tweaks required Quantified API. On the dedicated macOS
server, Quantified repeatedly launched Windows-native Vulkan and OpenCL probes,
allocated unusually large probe-thread stacks, and kept failed Forge processes
alive after the server thread had exited. This operational cost outweighed the
optional weathering optimization. Both the tweaks addon and Quantified API are
removed; base Immersive Weathering remains installed.

The post-removal fresh world reached `Done (135.752s)`. Its restart reached
`Done (20.528s)`, emitted no Quantified graphics probes and no Guard Villagers
config loop, then saved all three dimensions and stopped cleanly.

### Clouds and Distant Horizons

Better Clouds and its now-unused YACL dependency are removed. Embeddium Extra
already provides an adjustable vanilla cloud-height control, avoiding the
known Better Clouds/DH integration warning. Test a raised cloud layer with DH
and Oculus shaders on the client.

### Overworld biome turnover

Biome Sizes was tested and rejected: its smaller Overworld step reduced
Tectonic's already-minimum horizontal scale from 1 to invalid value 0. Instead,
Quark's climate-control module now ignores only humidity during biome matching.
Temperature, continentalness, erosion, depth, weirdness, and offset remain
active. This should broaden wet/dry biome variation within coherent warm and
cold regions without altering Tectonic's terrain scale. Inspect several fresh
seeds before selecting the permanent world. A fresh dedicated world reached
`Done (227.514s)`, initialized all three DH dimensions, then stopped with zero
incomplete DH tasks and all dimensions saved.

DH 3.2.0-b now runs on the dedicated server and successfully created separate
LOD databases for the Overworld, Nether, and End. The revised server reached
`Done (36.207s)` and DH closed all three generation queues and databases cleanly
on shutdown. Its generation mode is `INTERNAL_SERVER`, limited to two half-duty
threads, four generation requests per second, a 256-chunk request radius, and
bounded transfer rates. Xaero's Minimap and World Map also completed both
server initialization stages.

Chunky is removed. DH 2.3.4 removed the explicit incompatibility check, but its
authors note that Chunky can still outrun DH's processing queue and leave holes.
Use `/dh pregen` rather than operating both generators concurrently.

### Integrated Stronghold

YUNG's Better Strongholds has been replaced by Integrated Stronghold 1.1.2.
The End Remastered portal-room template override is shipped directly through
KubeJS data, so it applies automatically without manually enabling a world
datapack. A fresh-world dedicated server reached `Done (205.482s)` and shut
down cleanly. The long first launch was dominated by spawn generation.

The fresh test logged skipped optional `irons_spellbooks:priest` entities while
generating spawn. It also exposed an Integrated API shutdown bug: villagers
with asynchronous structure-map offers can fail to persist if their trade is
first resolved after Integrated API has already terminated its locator pool.
Confirm whether ordinary running saves persist these villagers and report or
work around the shutdown ordering before release.

### Nether and End expansion

Incendium 5.3.5 and Nullscape 1.2.2 are installed as server-side data-driven
worldgen layers. End's Phantasm 1.4 is installed on both sides because it adds
registered blocks, items, creatures, and gameplay. These exact versions still
require in-client inspection. A fresh world reached `Done (178.876s)`. Forced
chunks generated in both the Nether and End, the server located a Phantasm
Dreaming Den 995 blocks away and an Incendium Piglin Village 429 blocks away,
and shutdown saved all three dimensions with exit code 0.

Four malformed Phantasm block-drop tables are replaced by narrow data
overrides that preserve their intended Silk Touch, shears, and fallback drops;
the validation warnings are gone. Incendium's elytra smithing recipe cannot be
interpreted by KubeJS, which falls back to loading it as a vanilla recipe.
Confirm the four Phantasm blocks drop correctly and the Incendium elytra
upgrade appears and crafts in JEI. Also inspect
Nullscape/Phantasm biome placement, dragon-island generation, gateway travel,
and Incendium/YUNG fortress coexistence in a client.

### OptiFine-style client features

Embeddium Extra and Sodium/Embeddium Dynamic Lights are now client-only pack
defaults. Oculus 1.8.0 supplies optional shader loading, but no shader pack is
forced. General-purpose connected-texture resource-pack support remains
deliberately deferred until the renderer combination passes visual testing.

### Elytra slot and fair maps

Elytra Slot 6.4.4 and Caelus API 3.2.0 are installed on both sides. Verify that
the vanilla Elytra can be placed in its Curios slot, renders correctly with a
chestplate, consumes durability, receives Mending repairs, launches, and accepts
firework boosts. Quark's experimental dimension lock is disabled; acquisition
is still naturally post-End.

Ambercraft sends Xaero's documented `fairxaero` control signal on first join
and every reconnect. Verify on a client that surface mapping, explored map
history, waypoints, and deathpoints remain available while entity radar and
cave-mode mapping are locked out in both Minimap and World Map.

The exact Ambercraft 0.2.1 server bundle completed a fresh-world launch at
`Done (100.844s)`. Elytra Slot, Caelus, the fair-play load/tick functions,
KubeJS, and the server resource reload produced no errors. The server then
handled an interrupt as a normal shutdown, closed all three DH queues with zero
incomplete tasks, saved the Overworld, Nether, and End, and reported that all
dimensions were saved. Slot rendering, flight, repair, and client-side Xaero
enforcement still require the desktop client test described above.

The exact Ambercraft 0.2.2 server bundle completed a fresh-world launch at
`Done (61.082s)` after Zombie Awareness and its now-unused CoroUtil dependency
were removed. The server then handled an interrupt as a normal shutdown, closed
all three DH queues with zero incomplete tasks, saved the Overworld, Nether,
and End, and reported that all dimensions were saved.

The final 0.2.2 side-filter check assembled 71 client jars and 70 server jars
from the same Packwiz metadata. The client contained Distant Horizons,
Embeddium, ImmediatelyFast, and Oculus while omitting Spark, Incendium,
Nullscape, Zombie Awareness, and CoroUtil. The server archive omitted Oculus,
Embeddium, ImmediatelyFast, Mouse Tweaks, Zombie Awareness, and CoroUtil. The
Pterodactyl installer policy was also exercised against a disposable server
tree and applied the bounded G1 flags and all four intended server-property
changes exactly once.

### JEI catalogue size

The first multiplayer join loaded 14,757 JEI ingredients and produced 224
pages at the test client's GUI scale. Chipped accounts for 6,987 packaged item
models. Every Compat creates another 1,320 blocks, including 1,049 Chipped
compatibility variants. A client-side KubeJS filter now hides Chipped's
decorative variants while retaining all six Chipped workstations as visible
catalogue entry points. Confirm the next join substantially reduces the page
count and that every variant remains selectable through its workstation before
considering broader Every Compat filtering or removing Chipped.

Every Compat was subsequently removed rather than merely hidden. Its 1,320
generated blocks, including 1,049 Chipped compatibility variants, did not
justify their catalogue and resource-loading cost. Chipped remains available
through its six workstations for the next test.

### First pruning pass

The first post-audit candidate keeps Integrated Villages for a focused village
test but removes five features that were not earning their cost: Every Compat,
Mob Conversion, Jade Addons, KubeJS Create, and YUNG's Bridges. Mob Conversion's
only configured target was the absent `irons_spellbooks:priest`; KubeJS Create
was unused by the current scripts; and the other three duplicated decorative,
information, scripting, or surface-structure roles already covered elsewhere.

### Structure density and discovery notifications

Static structure-set review found most authored spacing already conservative.
The high-volume exceptions were Integrated Villages' regular village pool and
IDAS' common and small surface pools. Their spacing/separation values are now
48/32, 36/24, and 40/28 chunks respectively. Rare IDAS destinations, airship
villages, underground structures, YUNG replacements, boss encounters, Nether
destinations, and End destinations retain their original values.

The 46 visible advancements from IDAS, Integrated Villages, YUNG's Better
Desert Temples, and YUNG's Better Dungeons still record normally in their tabs,
but no longer display discovery-spoiling toasts or global chat announcements.
The server accepted all advancement and structure-set overrides during the
36.207-second validation start.

### Mowzie's Mobs first-run warnings

The first synchronized client launch generated the new Mowzie's Mobs config and
logged many default-value corrections. It also reported missing models for the
diamond and Black Pink Grottol variants. The client still completed its resource
reload, and neither custom Ambercraft item produced a missing-model warning.
Recheck the Mowzie warnings on the second launch and inspect Grottols in game.

### Final static balance pass

The cabin-village `stables_bottom` warning is addressed by a narrow template-pool
override that points the missing pool to an existing cabin foundation. A fresh
world reached `Done (146.569s)` without the warning, with zero KubeJS script
errors and a clean three-dimension Distant Horizons shutdown. Locate a cabin
village and inspect the affected building before treating the visual issue as
fully resolved; the upstream mod provides no purpose-built stable foundation.

Enhanced Celestials' hostile events are now less frequent and less saturated:
ordinary blood moons use a ten-night minimum gap, 5% chance, and 1.75x hostile
spawn multiplier; super blood moons use a forty-night minimum gap, 2% valid-moon
chance, and 3x multiplier. This preserves memorable emergencies without making
lunar events a routine punishment for late joiners.

Static validation confirmed every named Ambercraft progression loot table and
End Remastered item ID exists in the installed jars. Sixteen eyes remain
available for twelve frames. A dedicated server loaded five custom recipes,
removed all three default eye recipes, accepted the disabled advancement and
loot-table overrides, reached `Done (16.560s)`, and shut down cleanly.

The cooperative death handler was exercised directly by summoning and killing
a Frostmaw without players nearby. It correctly withheld only the campaign
shard, emitted the return-with-an-ally hint, and produced no script error. The
two-player success branch, global first-discovery announcement, Ledger
right-click output, client JEI hiding, and custom item model still require a
real client test.

## Next test gate

The next build is acceptable only when all of the following pass:

1. Dedicated server reaches `Done` with no missing mandatory dependencies.
2. IDAS continues to emit no errors for absent Ars Nouveau or Ice and Fire
   content.
3. A clean client installs from the same pack metadata and joins the server.
4. Distant Horizons, Embeddium, Embeddium Extra, Dynamic Lights, Oculus, and
   ImmediatelyFast render together without crashes; repeat once with
   Distant Horizons disabled.
5. Locate and inspect several Integrated Villages and major IDAS structures on
   Terralith and Tectonic terrain.
6. Verify one Create contraption, Copycats block, and Steam 'n' Rails train,
   including a server restart.
7. Verify Lootr ownership with two separate players.
8. Verify Corpse recovery with Curios and backpack contents.
9. Observe a lunar event near a village, then profile the server with spark.
10. Confirm the implemented End Remastered routes, tooltips, and Integrated
    Stronghold portal room work as documented in `PROGRESSION.md`.
11. Locate and defeat at least two Mowzie's Mobs encounters in multiplayer;
    verify biome placement, difficulty scaling, boss persistence, and whether
    their ability-granting rewards trivialize Artifacts or existing dungeons.
12. Enter a fresh Nether and End; verify Incendium structures, YUNG's fortress,
    Nullscape terrain, End's Phantasm biomes and structures, the dragon fight,
    gateways, and return travel.

Only after this gate passes should the permanent seed be selected and pregenerated.

## Client preparation — 2026-07-22

- Clean Packwiz client installation currently contains 71 jars after adding
  Mowzie's Mobs, LootJS, Integrated Stronghold, the three OptiFine-style client
  components, and End's Phantasm; client-required Lithostitched remains present,
  while Passable Foliage, Kiwi, Zombie Awareness, and CoroUtil remain removed.
- Spark and the YUNG structure implementations were correctly omitted as
  server-side entries. Chunky is no longer part of the pack.
- Distant Horizons, Oculus, Embeddium, Entity Culling,
  ImmediatelyFast, AmbientSounds, Sound Physics Remastered, and Xaero's maps
  are present in the clean client.
- Jade is installed on both sides so its server-backed data can be tested.
- Incendium and Nullscape are correctly omitted from the client as server-side
  datapack mods; End's Phantasm is present on both sides.
- A disposable Prism instance named `Living World - Client Test` was imported
  successfully.
- Packwiz's Modrinth export repeatedly produced an invalid zero-byte archive
  while embedding CurseForge-hosted files. Do not distribute that `.mrpack`.
  The local Prism test instance was instead assembled from the successful
  Packwiz client installation and its ZIP archive passed an integrity check.

The first client launch failed because Tectonic's Forge build declares
Lithostitched as a required client dependency even though Lithostitched's
project metadata describes it as server-side. The pack now deliberately
overrides that metadata and ships Lithostitched on both sides.

The remaining client gate requires relaunching this Prism instance, reaching
the title screen, visually checking the two custom items and their JEI recipes,
and then joining the test server. The synchronized launch reached KubeJS client
resource reload with one client script loaded and zero KubeJS errors.
