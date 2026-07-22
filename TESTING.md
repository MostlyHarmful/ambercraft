# Test status

This file records what has actually been verified. A mod appearing in the pack
or reaching the title screen is not sufficient evidence that its gameplay works.

## Verified baseline — 2026-07-22

- Platform: macOS arm64
- Java: Oracle Java 21.0.12
- Minecraft: 1.20.1
- Forge: 47.4.10
- Pack metadata: 88 resolved entries after adding Integrated Stronghold,
  Embeddium Extra, Sodium/Embeddium Dynamic Lights, Incendium, Nullscape, and
  End's Phantasm; this includes 81
  selected mods and seven automatically resolved dependencies
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

### Ecological overlap and broken hollow-log placement — configured

Quark's hollow-log module is disabled after its fallen hollow logs generated
detached on ocean surfaces in the CachyOS visual test. Quark's crab is disabled
in favor of the Friends & Foes crab, avoiding two nearly equivalent beach mobs.
Alex's Mobs fly spawn weight is set to zero because the creature did not add
enough atmosphere or gameplay to justify its entity population. Confirm all
three changes in a fresh world; existing entities or generated blocks are not
removed retroactively.

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

### Progression prototype — data validation passed

LootJS 2.13.1 and the Ambercraft KubeJS scripts registered two custom clue
components. KubeJS loaded the scripts with zero errors and accepted all three
prototype recipes with zero failures. The server reached `Done (15.052s)`.

Gameplay is not yet verified. A client must confirm the custom item models and
tooltips, JEI recipes, the 35% Integrated Village cleric-chest clue injection,
Lootr behavior, and the Frostmaw component drop before default End Remastered
routes are changed.

### Optional compatibility warnings

Supplementaries reports missing Farmer's Delight integration data. Farmer's
Delight is not currently part of this pack. Confirm that these remain optional,
non-fatal warnings; do not add the mod solely to silence them.

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

### Better Clouds and Distant Horizons

The synchronized Prism client reached `Client resource reload complete`, but
Better Clouds logged that Distant Horizons 3.2.0-b is not a compatible version.
Both mods continued initializing. Test their actual rendering together and with
Distant Horizons disabled before deciding whether this is a harmless disabled
integration or a reason to change one version.

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

Phantasm 1.4 logs four nonfatal loot-table validation warnings for block drops
whose conditional alternatives have an empty child list. Incendium's elytra
smithing recipe cannot be interpreted by KubeJS, which falls back to loading it
as a vanilla recipe. Confirm the four Phantasm blocks drop correctly and the
Incendium elytra upgrade appears and crafts in JEI before release. Also inspect
Nullscape/Phantasm biome placement, dragon-island generation, gateway travel,
and Incendium/YUNG fortress coexistence in a client.

### OptiFine-style client features

Embeddium Extra and Sodium/Embeddium Dynamic Lights are now client-only pack
defaults. Shader loading through Oculus and general-purpose connected-texture
resource-pack support remain deliberately deferred until the base Better
Clouds/Distant Horizons renderer combination passes visual testing.

### JEI catalogue size

The first multiplayer join loaded 14,757 JEI ingredients and produced 224
pages at the test client's GUI scale. Chipped accounts for 6,987 packaged item
models. Every Compat creates another 1,320 blocks, including 1,049 Chipped
compatibility variants. A client-side KubeJS filter now hides Chipped's
decorative variants while retaining all six Chipped workstations as visible
catalogue entry points. Confirm the next join substantially reduces the page
count and that every variant remains selectable through its workstation before
considering broader Every Compat filtering or removing Chipped.

### Mowzie's Mobs first-run warnings

The first synchronized client launch generated the new Mowzie's Mobs config and
logged many default-value corrections. It also reported missing models for the
diamond and Black Pink Grottol variants. The client still completed its resource
reload, and neither custom Ambercraft item produced a missing-model warning.
Recheck the Mowzie warnings on the second launch and inspect Grottols in game.

## Next test gate

The next build is acceptable only when all of the following pass:

1. Dedicated server reaches `Done` with no missing mandatory dependencies.
2. IDAS continues to emit no errors for absent Ars Nouveau or Ice and Fire
   content.
3. A clean client installs from the same pack metadata and joins the server.
4. Better Clouds, Distant Horizons, Embeddium, Embeddium Extra, Dynamic Lights,
   and ImmediatelyFast render together without crashes; repeat once with
   Distant Horizons disabled.
5. Locate and inspect several Integrated Villages and major IDAS structures on
   Terralith and Tectonic terrain.
6. Verify one Create contraption, Copycats block, and Steam 'n' Rails train,
   including a server restart.
7. Verify Lootr ownership with two separate players.
8. Verify Corpse recovery with Curios and backpack contents.
9. Observe a lunar event near a guarded village while Zombie Awareness is
   active, then profile the server with spark.
10. Confirm End Remastered and Integrated Stronghold agree on portal
    progression before implementing the custom eye campaign.
11. Locate and defeat at least two Mowzie's Mobs encounters in multiplayer;
    verify biome placement, difficulty scaling, boss persistence, and whether
    their ability-granting rewards trivialize Artifacts or existing dungeons.
12. Enter a fresh Nether and End; verify Incendium structures, YUNG's fortress,
    Nullscape terrain, End's Phantasm biomes and structures, the dragon fight,
    gateways, and return travel.

Only after this gate passes should the permanent seed be selected and pregenerated.

## Client preparation — 2026-07-22

- Clean Packwiz client installation currently contains 80 jars after adding
  Mowzie's Mobs, LootJS, Integrated Stronghold, the three OptiFine-style client
  components, and End's Phantasm; client-required Lithostitched remains present,
  while Passable Foliage and Kiwi remain removed.
- Chunky, spark, and the YUNG structure implementations were correctly omitted
  as server-side entries.
- Better Clouds, YACL, Distant Horizons, Embeddium, Entity Culling,
  ImmediatelyFast, AmbientSounds, Sound Physics Remastered, and Xaero's maps
  are present in the clean client.
- Jade and Jade Addons are installed on both sides so their server-backed data
  and integrations can be tested.
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
