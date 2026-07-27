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

## Combat, Cataclysm, and Ledger candidate — 2026-07-27

The 107-mod candidate adds Better Combat, Shield Expansion, Cataclysm,
Integrated Cataclysm, FTB Quests, and YUNG's Better End Island. Ambercraft
supplies authored Better Combat profiles for Alex's Caves, Mowzie's Mobs,
Farmer's Delight, and Phantasm weapons; Cataclysm's signature melee weapons
retain the profiles shipped by Cataclysm itself. Shield Expansion recognizes
Alex's Caves' Resistor Shield through an Ambercraft compatibility definition.

The Expedition Ledger now loads as a linked 21-node main chapter: one central
briefing, sixteen shared Eye hints surrounding a twelve-of-sixteen portal
objective, and the stronghold, opened portal, and dragon milestones. A 19-node optional chapter covers
the six rare Alex's Caves regions, four Cataclysm site-and-boss pairs, and
Create's long-train milestone. KubeJS persistent world data remains
authoritative and synchronizes the shared custom entries when players join or
when an eye is first discovered. The physical ledger item remains registered
for existing inventories but is no longer craftable or required.

The final isolated dedicated-server candidate loaded all 107 mods. A later hot
reload parsed both authored chapters, all 40 quests, and all three KubeJS server
scripts without errors or warnings. The original cold-start smoke loaded
the weapon registry, recipes, and datapacks; it reached `Done (45.292s)`.

The later polish pass explicitly enables dependency lines on every linked main
quest. Boss campaign rewards no longer enforce a two-player minimum; a living
player within 64 blocks receives the component whether fighting alone or with
the group.
Forceloading the central End chunk initialized the End and its Distant Horizons
data without a YUNG's Better End Island/Nullscape error. The forceload was then
removed and the server shut down cleanly. This validates parsing, server
construction, and basic End initialization, not client animations, shield
timing, quest-button presentation, the complete island layout, or boss reward
balance.

Before live deployment:

1. Join with a candidate client and verify the inventory quest button, ledger
   synchronization, weapon animations, dual wielding, two-handed shield
   exclusion, and Resistor Shield behavior.
2. Back up the complete live world while the server is fully stopped.
3. Because no player has visited the live End, delete only that world's `DIM1`
   directory (including its stale Distant Horizons database) before the first
   launch of this candidate. Do not delete the Overworld, Nether, player data,
   or the complete world.
4. Confirm the freshly generated End produces the tower, exit portal, pillars,
   and summon
   behavior correctly alongside Nullscape before the first dragon attempt.

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
detached on ocean surfaces in the CachyOS visual test. Quark's crab remains
disabled after Friends & Foes was removed; the pack does not need another
low-impact ambient beach mob. Alex's Mobs fly spawn weight is reduced from
three to one so maggots remain naturally obtainable. The automatic Animal
Dictionary handout is disabled. Confirm all changes in a fresh world; existing
entities, generated blocks, and already-issued books are not removed
retroactively.

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

### Guard Villagers 1.6.18 — rejected

Guard Villagers 1.6.18 repeatedly rewrote its generated common config every two
seconds on both the client and dedicated server. During the first real client
join, the server also accumulated severe tick delays and ultimately triggered
the 60-second watchdog while waiting for chunk generation. The crash report did
not attribute the stall directly to Guard Villagers, but the continuous config
rewrite is unacceptable independently. That exact release remains rejected.

### Guard Villagers 1.6.17 — restrained reintroduction candidate

The replacement candidate pins Guard Villagers 1.6.17 and adds Mob Conversion
1.0.1. Guard Villagers' group village spawning is disabled. Integrated
Villages' authored guards remain in future structures, while an existing or
damaged bell-defined village may convert only a nitwit or unemployed vanilla
villager. The managed cap is four guards within 96 blocks, with a 12,000-tick
shared cooldown and no population spawning.

Regular village patrols are enabled so four guards can cover the large village
layouts. Guards retain local hostile targeting, a 24-block follow range, and a
50-block response range for mobs attacking villagers. Friendly arrow damage is
disabled. Existing chunks are not rewritten.

Before release, run both a dedicated-server and client smoke test. Confirm:

1. `config/guardvillagers-common.toml` does not rewrite repeatedly or create
   backup churn for at least five minutes.
2. A newly generated Integrated Village contains native guards rather than the
   former iron-golem substitutions.
3. An old bell-defined village can promote an eligible villager after a nearby
   threat, but never exceeds four guards in the configured area.
4. Guards patrol, attack nearby modded hostiles, and do not shoot villagers,
   iron golems, or one another.
5. No noticeable tick-time regression appears near a large village.

The isolated dedicated-server smoke test on July 25, 2026 loaded Guard
Villagers 1.6.17 and Mob Conversion 1.0.1, generated a fresh world, and reached
`Done (51.843s)`. Forge emitted two startup-stage config-correction notices for
Guard Villagers, but the managed file remained byte-for-byte identical
(`188aed036a66757b91ca6cd1c41ca96bba318fd04acff5f54f9c4ae12af0319e`),
its modification time stayed fixed after initialization, and no backup files
or repeated two-second writes appeared. The server then shut down cleanly.

This clears the prior config-loop blocker. Client joining, native guard
generation, promotion behavior, the four-guard cap, and live village tick cost
remain gameplay validation gates.

The same 0.3.0 candidate was deployed to the retained Pterodactyl world on
July 25, 2026. The installer created
`backups/ambercraft-pack-before-20260726T004546Z.tar.gz`, installed the pinned
1.6.17 guard jar and Mob Conversion 1.0.1, and preserved the existing world.
The live server reached `Done (3.759s)`. Its managed guard config retained the
expected SHA-256 after the two initialization-stage correction notices, with
no subsequent rewrite loop or fatal startup error.

Legacy Integrated Villages from the iron-golem substitution period are migrated
without touching ordinary golems. The initial Guard-specific NBT signature did
not survive once the substituted entities were saved as iron golems. All twelve
authored templates do retain `PersistenceRequired:1b`, while naturally spawned
and player-built golems do not set that flag. The server checks loaded Overworld
entities for that durable signature every ten seconds and replaces matches with
persistent sword-and-shield guards. Processed source golems are killed after
their replacement is created. The check remains available for old villages in
unloaded chunks.

The first persistent-field deployment revealed that below-world source golems
could remain registered long enough to match again, producing three replacement
guards every ten seconds in the loaded village. The corrected migration marks
each source before summoning, so it is idempotent even if retirement is delayed.
It also recognizes and kills every guard tagged by the faulty pass. Correct
replacements use a separate tag and are unaffected. An attempted spatial
deduplication was rejected because command execution forked all candidates
before applying keeper tags, causing every duplicate to qualify as a keeper.
Sources already moved below build height are marked but do not summon another
guard; the retained in-village copy represents them.

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
tree and applied the bounded G1 flags and all five intended server-property
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

### Quark consolidation candidate

Ambercraft 0.2.5 removes Friends & Foes, Sophisticated Backpacks, and
Sophisticated Core. Friends & Foes no longer had a distinct ecological,
structure, or encounter role beside Alex's Mobs, Mowzie's Mobs, IDAS, YUNG,
and Incendium. Quark's crab remains disabled rather than replacing it.

Quark's Backpack is now the sole portable expedition-storage system. The exact
1.20.1 implementation is a chest-slot item, so it intentionally trades chest
armor for capacity; Elytra continues to use its separate Curios slot. Quark's
Pipes are disabled because Create owns item logistics. Corpse and its Curios
compatibility remain the dedicated death-recovery system, while Quark's Totem
of Holding remains disabled.

### Release balance and exploit guardrails

The deployment installer now sets `difficulty=hard`. This supplies the intended
combat pressure without globally inflating every creature into a health sponge.
Alex's Mobs' Void Worm is the exception: its health is 240 and damage modifier
1.1 so the optional post-End encounter remains a real group challenge.

Alex's Mobs' common Nether pressure was reduced rather than removed: Straddler
weight is 35 and Laviathan weight is 8. Its Incendium biome entries remain
enabled, preserving the intended ecology without letting two creatures dominate
the expanded Nether. Mimicream can no longer repair its zero-durability copies,
and transmutation is restricted to authored tables.

Artifacts remains Ambercraft's exploration-only capability layer, but campsite
generation and artifact frequency are lower. Everlasting Beef and Eternal Steak
are removed because infinite food would erase expedition preparation and much
of Farmer's Delight. Supplementaries now owns the pack's general-purpose rope;
Farmer's Delight fences and safety nets use that rope through replacement
recipes.

Carry On no longer permits hostile mobs, players, stacking carried entities,
Lootr containers, Create machinery, campaign blocks, bosses, mimics, corpses,
portals, spawners, beds, or other progression-sensitive blocks. Ordinary
animals and household containers remain portable.

Quark's Pathfinder Maps are disabled because the Expedition Ledger supplies
spoiler-light direction. Quark Pipes remain disabled in favor of Create, and
display-name collisions for the two cloud and wrench items are clarified.

The exact 0.2.5 server bundle completed its validation restart at
`Done (8.452s)`. KubeJS loaded its sole server script with zero errors and zero
warnings; the recipe pass added 11 recipes, removed 8, and reported zero failed
recipes. Distant Horizons closed all three dimensions with zero incomplete
generation tasks. The remaining Incendium smithing-recipe parse warning is an
upstream fallback already present before this balance pass.

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
Inspection found a malformed comment embedded in both upstream model texture
maps. Ambercraft now supplies narrow corrected models for those two variants.
Recheck the warnings after a full client restart and inspect Grottols in game.

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
8. Verify Quark Backpack capacity, access, chest-armor exclusion, Elytra-slot
   coexistence, and Corpse recovery of the backpack and all of its contents.
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

## Performance candidate 0.2.6

Ambercraft 0.2.6 adds FerriteCore 6.0.1 and ModernFix 5.27.66 on both sides.
FerriteCore is the low-risk memory optimization; ModernFix is the broader
startup, memory, and bug-fix trial and must pass both dedicated-server and
renderer tests before release. No additional overlapping lighting, ticking, or
memory-fix mod is included.

Deployment now enforces view distance 10 and simulation distance 6. Distant
Horizons remains responsible for distant terrain, while the smaller simulation
radius reduces continuously ticking chunks when players separate. The server
retains the measured `-Xms1G -Xmx6G -XX:+UseG1GC` profile; the full Aikar flag
bundle and P/E-core affinity are intentionally absent.

Before accepting this candidate:

1. Confirm both new mods load on a clean dedicated-server start.
2. Confirm the client reaches the title screen with Embeddium, Oculus,
   ImmediatelyFast, and Distant Horizons together.
3. Join the server and verify KubeJS reload, Create contraptions, and DH
   delivery.
4. Capture idle, existing-chunk travel, and fresh-generation spark profiles.
5. Compare total container memory and GC behavior with the recorded 0.2.5 G1
   baseline.

The Framework host currently exposes only 16 GiB despite a possible second
16 GiB module, and its Linux kernel exposes no active Intel frequency driver.
Physical inspection, BIOS 3.20, and enabling Intel Speed Shift/HWP remain host
maintenance tasks; they are not worked around with JVM flags in this pack.

The exact 0.2.6 bundle was deployed to the existing Pterodactyl test world and
reached `Done (9.832s)` after ModernFix reported 58.545 seconds for the complete
process startup. ModernFix loaded all 110 default options, FerriteCore was
present, and KubeJS loaded one server script with zero errors and warnings.
The familiar Incendium smithing fallback remained the only recipe parse
warning.

Live verification showed `difficulty=hard`, `view-distance=10`, and
`simulation-distance=6`. The JVM reported a 1 GiB initial heap, 6 GiB maximum
heap, and G1GC. Total container use was approximately 3.0 GiB out of 8.4 GiB
immediately after startup. The isolated startup test does not replace the
required client launch or multiplayer spark profiles.

## Enchantment workshop candidate 0.2.7

Ambercraft 0.2.7 adds Create: Enchantment Industry 1.4.0, the build explicitly
targeting Create 6.0.8. Quark Matrix Enchanting is disabled so the pack has one
intentional non-vanilla enchanting system.

The server defaults disable hyper-enchanting and cap its extension at zero.
KubeJS removes the Hyper Experience mixing recipe, which also closes the mod's
Quark Ancient Tome printing route. Both enchanted-book copy coefficients are
set to 100x against a 4000 mB printer tank, making book cloning practically
unavailable while written books, name tags, train schedules, and clipboards
remain printable. Ordinary Blaze Enchanter work costs 1.5x experience.
Deployer and crushing-wheel XP recovery are reduced to avoid lossless mob-farm
loops.

Before accepting this candidate:

1. Confirm the generated world server config accepts all managed values without
   correction or reset.
2. Confirm KubeJS removes the Hyper Experience recipe with no script errors.
3. Verify a Blaze Enchanter can enchant ordinary gear and a spout can repair an
   already-Mending item.
4. Verify an enchanted book and Quark Ancient Tome cannot be copied, while a
   written book and train schedule can.
5. Confirm JEI exposes no craftable Hyper Experience route and that Enchantment
   Industry does not re-enable Quark Matrix Enchanting.

The final 0.2.7 bundle passed the 86-mod, 234-file Packwiz audit and was
deployed to Pterodactyl. The existing test world reached `Done (2.882s)` with a
27.552-second complete process startup. KubeJS loaded its one server script
with zero errors and zero warnings, processed 9,013 recipes, removed nine, and
reported no failed recipes. Forge accepted the normalized Enchantment Industry
server config on the second startup without correcting it. The Incendium
smithing fallback and the already-known Carry On and Alex's Mobs config
normalizations remain; none prevented startup.

This smoke test proves server loading and configuration syntax, not the five
in-game behavior checks above. Those remain client test gates.

### Client candidate 0.2.7

A fresh Packwiz client install from the same candidate resolved 76 jars. It
correctly included Create: Enchantment Industry, Oculus, Embeddium, JEI,
Distant Horizons, FerriteCore, and ModernFix while omitting Spark, Incendium,
Nullscape, and the server-side YUNG structure implementations.

The clean Prism instance launched Forge 47.4.10 on Oracle Java 21.0.12 with
Generational ZGC after enabling Prism's per-instance Java compatibility
override. KubeJS loaded one startup script and two client scripts with zero
errors or warnings. Oculus recognized the Apple M3/OpenGL 4.1 renderer, exposed
its shader-pack page, and remained disabled because no shader pack was forced.
AmbientSounds, Sound Physics, Xaero's shaders, JEI, Create/Flywheel, and the
resource reload all completed. The first title-screen launch took about 41
seconds.

The first resource pass exposed three visible upstream asset defects:

- malformed Diamond and Black Pink Grottol models from Mowzie's Mobs;
- Cave Delight models targeting removed Farmer's Delight pie parents and one
  unqualified Trilocaris parent;
- Phantasm's optional Farmer's Delight cabinet and knife assets not being
  activated automatically.

Ambercraft now ships narrow resource overrides for those entries. The
Phantasm fallback deliberately uses its normal Pream plank and crystalline
sword textures rather than duplicating binary assets from the mod jar. A full
restart is still required to confirm that all repaired models render.

The refreshed candidate joined the dedicated server successfully. JEI was
reduced from 224 pages in the original candidate to 46 pages. Xaero displayed
no entity dots and its cave map was disabled by the server's fair-play signal.
Distant Horizons initialized its server-specific database, received the
server level, and progressively displayed distant terrain. The client remained
connected long enough to validate those systems.

After roughly 22 minutes, Oracle Java 21.0.12 on the Apple M3 terminated with
`SIGBUS` inside Generational ZGC's `ZRelocateWork` worker. This was a fatal JVM
error rather than a Forge or mod exception. The client default now uses regular
ZGC without `-XX:+ZGenerational`; the dedicated server remains on G1. A
corrected run joined the server, flew through newly generated terrain in
creative mode, and then shut down cleanly. No additional JVM fatal log was
created.

A later regular-ZGC session terminated after eight minutes with `SIGSEGV` in
Oracle 21.0.12's native C2 compiler (`Chunk::chop`) while compiling ASM code.
There was again no Forge crash report or Java exception identifying a mod.
The Apple Silicon validation client therefore returns to G1; ZGC should only
be used on the CachyOS desktop after its installed JDK passes a longer soak.

Recipe synchronization exposed a harmless Quark/Zeta creative-tab ordering
loop. Ambercraft now enables Zeta's append-only failsafe in
`config/zeta-common.toml`. The generic Distant Horizons/Alex's Caves warning
continued despite the required Alex's Caves ambient-light setting already
being disabled, so the now-redundant compatibility popup is suppressed.

Integrated Villages embeds optional Guard Villagers and Iron's Spellbooks
entities in 19 structure templates. The earlier release replaced those missing
entities with vanilla iron golems and villagers through generated structure
overrides. Those overrides only affected newly generated structures.

The first replacement pass preserved Guard Villagers' `Health: 20.0f` NBT on
the substituted iron golems. A generated Integrated Village confirmed the
visible result: full-sized golems with only ten hearts. A later patch corrected
future replacements to vanilla iron-golem health (`100.0f`). The new Guard
Villagers candidate removes all twelve guard substitutions and preserves only
the seven Iron's Spellbooks priest-to-villager overrides. Existing generated
golems retain their current state; unexplored villages regain authored guards.

The refreshed importable Prism archive
`exports/Ambercraft-0.2.7-Prism.zip` contains 76 client jars, passed
`unzip -t`, and has SHA-256
`af80e30076b14653250d9951a01e6d705e35135a3b7ea894e7c426575384f5a3`.
The matching server artifact
`build/deployment/ambercraft-server-0.2.7.tar.gz` contains 74 server jars,
passed `gzip -t`, and has SHA-256
`6c9c53c3ed200bcf3f52135df77540b3b27552a36eb01dbe95f451f2a2cb4f8e`.
The mixed-site `.mrpack` export again failed before producing a usable archive
and must not be distributed.

The corrected restart showed no creative-tab loop and no Alex's Caves/DH
compatibility popup. Remaining non-blocking client checks are visual inspection
of the final Cave Delight aliases, Elytra-slot behavior, and the Enchantment
Industry gameplay checks above. Remaining server gates are a fresh-world
structure-generation pass and confirmation that the Integrated Villages entity
warnings no longer appear.

### Pterodactyl deployment

The verified 0.2.7 server bundle was deployed to Ambercraft on July 23, 2026.
The prior disposable world and generated pack state are recoverable from
`/home/container/backups/ambercraft-reset-20260723T215924Z`.

The fresh world reached `Done (58.584s)` without a KubeJS error, fatal error,
or missing Guard Villagers/Iron's Spellbooks entity warning during spawn
generation. The running container contained 74 jars and initially used about
3.15 GiB of its 8.4 GiB allocation. `jcmd` confirmed G1 with a 1 GiB initial
heap and 6 GiB maximum heap. Hard difficulty, flight, zero spawn protection,
view distance 10, simulation distance 6, and the Ambercraft MOTD were active.
`Pazelle42` remained in `ops.json`.

## Backpack and JVM follow-up candidate 0.2.8

Ambercraft 0.2.8 adds Sophisticated Backpacks, Sophisticated Core, and the
official Create contraption integration at the group's request. Quark Oddities
is not installed; direct structure-data inspection found no Oddities blocks or
items in IDAS or Integrated Villages, so adding that addon would not repair a
pack dependency.

Backpacks are deliberately bounded: structure loot does not hand out bags or
upgrades, storage rises from 27 leather slots to 81 Netherite slots, container
items cannot be nested inside, other players cannot open a worn bag, and only
one stack upgrade is allowed. KubeJS permanently removes Inception and Omega.
Stack tiers 2 through 4 use custom milestone recipes requiring, respectively,
Blaze Rods, Alex's Caves Telecores, and post-dragon End resources. Basic pickup,
deposit, refill, crafting, sorting, and Create contraption behavior remain
available. Mob-catcher upgrades are removed because they supersede Carry On and
can trivialize creature transport; feeding upgrades are removed because they
automate away the pack's expedition-food loop.

The candidate passed the 89-mod, 277-file Packwiz audit, JavaScript syntax
check, shell syntax check, ZIP integrity check, and server archive integrity
check. The client artifact contains 79 jars:
`exports/Ambercraft-0.2.8-Prism.zip`, SHA-256
`e9c283621ee753852075033aaa4dd545eba348ba169c1341b1aaf7e44b4f879f`.
The server artifact contains 77 jars:
`build/deployment/ambercraft-server-0.2.8.tar.gz`, SHA-256
`b223680c727b9bfdff4c4254ca7c66202d74ef3a04b9b56d902a145aeed437e2`.

The server is ready for an in-game fresh-world pass. Newly generated
Integrated Villages outside the spawn region still need inspection to confirm
their vanilla golem/villager substitutions and terrain placement.
## Ambercraft 0.2.8 Java 17 client smoke test

The packaged Prism instance reached the title screen on the Prism-managed
Microsoft OpenJDK 17.0.8 runtime with G1. Forge 47.4.10 loaded the pack's KubeJS
startup and client scripts with zero script errors or warnings. This confirms
Java 17 as the supported client runtime for the release candidate.

The matching server archive was deployed to the retained Pterodactyl world and
reached `Done (2.597s)`. The running container has all 77 server jars, the world
and `Pazelle42` operator entry remain present, and the Sophisticated Backpacks
server configuration retained Ambercraft's capacities and one-stack-upgrade
limit. KubeJS loaded both scripts with zero script errors or warnings; its
recipe pass added 14 recipes, removed 18, and reported zero failed recipes.
The known Incendium smithing-template fallback warning remains non-fatal.

## Graceful-stop maintenance candidate 0.2.9

Ambercraft 0.2.9 adds `ambercraft:graceful_stop`, which runs `save-all flush`
before the normal `stop` command. Deployment sets
`function-permission-level=4` so the server-authored function may invoke the
operator-level shutdown command. This narrows Integrated API's asynchronous
structure-map villager persistence race while still allowing Forge and Distant
Horizons to complete their normal shutdown lifecycle.

Ambercraft is the only Pterodactyl server assigned to the Forge egg at the time
of this change, so setting that egg's stop command to
`function ambercraft:graceful_stop` does not impose an Ambercraft-specific
function on another server.

The candidate passed the 89-mod, 278-file Packwiz audit, shell syntax check,
client ZIP integrity check, and server archive integrity check. The client
artifact is `exports/Ambercraft-0.2.9-Prism.zip`, SHA-256
`218ed5bd5fbd7c41a9aefa800a914686e929e55afc0db1559c4dabd10c31cc95`.
The server artifact is
`build/deployment/ambercraft-server-0.2.9.tar.gz`, SHA-256
`cd8277dc914f004e33074ef4c5dce27d538014adbabc3236c959ec44e7009a83`.

The 0.2.9 bundle was deployed to the retained Pterodactyl world and reached
`Done (54.100s)` on its first launch. Pterodactyl's normal Stop action invoked
the new function successfully: all three dimensions were saved before shutdown,
then Distant Horizons closed all three generation queues and database
connections, and Forge completed its final player/chunk save. The container
exited normally. Its validation restart reached `Done (3.359s)` and was left
online.

## Server exploration-pressure patch

The retained Pterodactyl world accepted the server-only exploration patch and
reached `Done (3.099s)`. KubeJS loaded with zero errors and warnings and
reported zero failed recipes. The live server now runs view distance 8 and
simulation distance 6, has Distant Horizons independent generation disabled,
and includes Chunky 1.3.146 for bounded offline pregeneration.

Sophisticated Backpacks now permits one backpack without penalty. Each
additional carried backpack adds one level of Slowness, and only the worn
backpack can trigger active upgrades. Existing anti-nesting and removed
Inception-upgrade safeguards remain in place. Ordinary blood moons now have a
10 percent eligible-night chance after a minimum seven-night interval; their
existing sleep block remains active.

Better Caravans 1.0.3 subsequently crashed the dedicated server with a
`ConcurrentModificationException` in `CaravanManager.tick` as the final player
disconnected. Minecraft completed its world save and Distant Horizons closed
its levels normally. Better Caravans was removed because the failure is in its
unconfigurable runtime collection handling and can recur during caravan unload.
The server hotfix reached `Done (3.263s)` with zero KubeJS errors, warnings, or
failed recipes. The GitHub release client archive was replaced in place after
removing the same JAR; its SHA-256 is
`ea466c4d7c4d4ba816ac98816afbf7f762d217efe9af2871b43e70c70e11015b`.

## Ambercraft 0.3.0 integration candidate

The 0.3.0 static audit covers 107 Packwiz entries and 312 indexed files. All
bundled JSON parsed successfully, all three KubeJS server scripts passed a
syntax check, and every custom progression loot-table target was confirmed in
the exact installed mod JARs. The current structure spacing keeps Integrated
Villages on a 48-chunk grid, the two common IDAS surface pools on separate
36- and 40-chunk grids, and major Cataclysm sites on substantially wider
48- to 160-chunk grids depending on their size and dimension.

The exact server archive completed a fresh Java 21 launch at
`Done (65.758s)`. KubeJS loaded three server scripts with zero errors or
warnings, added 13 recipes, removed 19, and reported zero failed recipes. FTB
Quests loaded two chapters and 40 quests. The graceful-stop function also
loaded successfully with the same `function-permission-level=4` applied by the
Pterodactyl deployment script. The remaining log noise is known upstream
behavior: Connector's server-side Fabric screen mixins, Moonlight's generic
Connector warning, and KubeJS falling back to vanilla parsing for Incendium's
Elytra smithing recipe.

Xaero and its join-time fair-play functions are absent. Hoofprint is now the
client surface-map interface, with Surveyor on both sides for synchronized
exploration data. Hoofprint has no cave-map or entity-radar feature to expose.
Chunky remains server-only for bounded offline full-chunk generation; it must
not run concurrently with DH pregeneration.

The final local artifacts contain 104 client JARs and 94 server JARs:

- `exports/Ambercraft-0.3.0-Prism.zip`:
  `024d6b92cb33288598b422a91324f3ccf134109f99866a7798a68a22bf3858aa`
- `build/deployment/ambercraft-server-0.3.0.tar.gz`:
  `9a297a009ddfde500302de58a82c17a89feee99596588b81741bba5bfbfb6f81`
