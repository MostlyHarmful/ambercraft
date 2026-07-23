# Ambercraft static content audit

This audit describes the first-release candidate after the July 2026 pruning
pass. It is based on the exact Packwiz metadata, bundled data files, generated
configs, registries, recipes, loot tables, structure sets, and language entries.
It deliberately distinguishes static facts from questions that require play.

## Final role map

### Terrain and dimensions

- **Terralith** supplies broad Overworld biome variety using Minecraft blocks.
- **Tectonic** supplies continental scale, valleys, cliffs, high terrain, and
  unusual formations. Lithostitched is required infrastructure.
- **YUNG's Cave Biomes** enriches ordinary caves with the Ice Cube and Sand
  Snapper; it does not replace Alex's Caves' rare destination biomes.
- **Alex's Caves** supplies six rare cave regions, specialized hazards,
  vehicles, creatures, resources, structures, and major capability rewards.
- **Incendium** is the Nether terrain and destination layer.
- **Nullscape** is the End terrain layer.
- **End's Phantasm** is the End ecology, blocks, creatures, and structure layer.

These roles are complementary. Quark's overlapping generic stone clusters,
fallen logs, Nether spikes, spiral spires, chorus vegetation, and new stone
generation are disabled. Quark blocks needed by IDAS remain registered.
Quark's climate matcher ignores humidity only, broadening local biome variety
while retaining temperature and terrain-related climate axes.

### Generated destinations

- **Integrated Villages** owns villages. Its regular pool includes tavern,
  pirate, Mediterranean, Kutcha, oasis, Mossy Mounds, cabin, Minka,
  marketstead, clockwork, and sunken themes; airship villages use a separate
  set. Its exceptional settlements justify retaining it for release one.
- **IDAS** owns original integrated landmarks. Its eight live structure sets
  cover common, rare, small, ocean, underground, and Nether destinations.
  Named content includes campsites, inns, workshops, ancient mines and portals,
  pillager sites, ruined sites, the Labyrinth, Necromancer's Spire, Tinker's
  Citadel, train ruins, museums, bazaars, ships, and many small dwellings.
- **Integrated Stronghold** exclusively owns the stronghold role and contains
  the End Remastered-compatible portal-room override.
- **YUNG's Better** Desert Temples, Dungeons, Jungle Temples, Mineshafts,
  Nether Fortresses, Ocean Monuments, and Witch Huts replace or enlarge their
  corresponding vanilla landmark. Bridges were removed because they added
  surface density without a campaign role.
- **Mowzie's Mobs** generates Frostmaw spawns, Umvuthana groves, wrought
  chambers, and monasteries.
- **Alex's Caves** has fourteen primary structure sets, including ruins,
  geological formations, Gingerbread Town, Licowitch Tower, trenches, and
  underground cabins.
- **End's Phantasm** generates Acidburnt Ruins and Shattered Towers.

IDAS' optional Ars Nouveau and Ice and Fire structures remain disabled through
narrow KubeJS data overrides. Those large content mods are not required.

### Creatures and encounters

- **Alex's Mobs** is the broad wildlife layer. It contains roughly ninety
  primary creatures plus multipart/projectile/helper entities. Flies use a
  one-third spawn weight so maggots remain naturally obtainable without making
  flies a dominant ambient creature.
- **Alex's Caves** owns creatures confined to its six cave ecosystems. These
  include Deep Ones, dinosaurs, magnetic constructs, irradiated creatures,
  abyssal life, Forlorn Hollows inhabitants, and Candy Cavity creatures.
- **Mowzie's Mobs** is the focused legendary-encounter layer: Foliaath,
  Ferrous Wroughtnaut, Frostmaw, Grottol, Naga, Sculptor, Umvuthana, Umvuthi,
  and their encounter helpers.
- **YUNG's Cave Biomes** adds Ice Cubes and Sand Snappers to ordinary caves.
- **End's Phantasm** adds Behemoths, Crysties, Polyppies, and Sour Sludge to
  the expanded End.
- **Quark** retains Forgotten, Foxhound, Shiba, Stonelings, Toretoise, and
  Wraith because IDAS uses some Quark creatures and their encounters are
  distinct from ordinary wildlife. Its crab remains disabled rather than
  reintroducing another low-impact ambient animal after Friends & Foes was
  removed.

### Dynamic world systems

- **Serene Seasons** changes Overworld color, weather, snow, and crop speed.
  Seasons no longer advance while the server is empty; out-of-season crops
  grow slowly instead of becoming impossible.
- **Enhanced Celestials** supplies rare global lunar conditions.
- **Immersive Weathering** supplies rust, moss, cracking, soot, leaf piles,
  icicles, and environmental aging. Rust and leaf-pile intensity are reduced.
- **The Roads More Travelled** records repeated traffic. Thresholds are raised
  substantially, and it no longer destroys leaves or garden vegetation.
- **Better Caravans** supplies mobile traders, escorts, and caravan incidents.

These systems remain intentionally independent: calendar, sky event, physical
aging, player trace, traveling NPC activity, and hostile reaction. Their rates
are conservative so several systems can overlap without constant interruption.
Ordinary blood moons now have a 5% nightly chance after a ten-night minimum
gap and raise hostile spawning to 1.75x, down from 10% after four nights and
2.25x. Super blood moons are deliberately exceptional: 2% on a valid full moon
after a forty-night minimum gap, with a 3x rather than 4.5x multiplier.

### Building and infrastructure

- **Create**, **Copycats+**, and **Steam 'n' Rails** form one version-locked
  infrastructure family. Create is optional play, not a mandatory tech tree.
- **Supplementaries** and **Amendments** add functional interactions to
  recognizable Minecraft objects.
- **Handcrafted** supplies focused furniture.
- **Chipped** supplies texture families through six workstations. Its thousands
  of variants remain hidden from JEI but accessible through those workstations.
- **Quark** supplies blocks directly used by Integrated Villages and IDAS,
  including shingles, thatch, vertical planks, stools, corundum, blossom wood,
  and permafrost content.

**Every Compat was removed.** It generated 1,320 blocks, including 1,049
Chipped compatibility blocks, without enough non-vanilla wood families to
justify the catalogue and loading cost.

### Exploration rewards and safety

- **Artifacts** supplies structure-discovered wearable capabilities.
- **Sophisticated Backpacks** supplies shared expedition storage and integrates
  with Create contraptions. Quark Oddities is not installed, so Quark's
  backpack is unavailable rather than an overlapping alternative. Finished
  backpacks and upgrades are excluded from chest loot. Capacities rise from 27
  slots at leather to 81 at Netherite; bags cannot contain shulkers or other
  container items; and only one stack upgrade fits. Inception and Omega remain
  unavailable. The upper stack tiers instead require, in order, a Nether
  expedition, Telecores from Alex's Caves, and post-dragon End resources. This
  preserves useful sorting and infrastructure interactions while turning major
  capacity increases into communal campaign rewards. Mob-catcher upgrades are
  removed in favor of Carry On's bounded, hands-occupied transport, and feeding
  upgrades are removed so expeditions still consume prepared food.
- **Lootr** gives players individual structure loot.
- **Corpse** and its Curios compatibility preserve death retrieval without
  enabling keep-inventory. Quark's duplicate Totem of Holding is disabled.
- **Elytra Slot** and **Caelus API** let a recovered Elytra occupy its own
  Curios slot while chest armor remains equipped. This changes equipment
  convenience, not Elytra acquisition: the wings still require reaching the
  End. Quark's experimental End-only flight restriction is disabled so an
  earned Elytra remains useful when the expedition returns home.
- **End Remastered**, KubeJS, and LootJS form the campaign spine documented in
  `PROGRESSION.md`.
- **Farmer's Delight** owns everyday food progression and expedition
  preparation. Artifacts' infinite beef and steak are disabled so cooking,
  farming, and carried supplies remain meaningful.
- **Supplementaries** owns the common rope item. Farmer's Delight rope fences
  and safety nets retain their uses through unified recipes without a duplicate
  rope entry.
- **Create: Enchantment Industry** gives factory-minded players a communal
  enchanting, repair, and experience-processing project. Quark Matrix
  Enchanting is disabled to avoid two competing enchanting overhauls. Hyper
  Experience production and hyper-enchanting are disabled, and enchanted-book
  copying is priced beyond the printer's practical capacity; discovered
  Mending books, treasure enchantments, and Ancient Tomes therefore remain
  meaningful finds. Written books, name tags, schedules, and clipboards remain
  printable.

### Client and administration

- Embeddium, Embeddium Extra, Dynamic Lights, Entity Culling, ImmediatelyFast,
  Oculus, AmbientSounds, Sound Physics, AppleSkin, Mouse Tweaks,
  and JEI are client experience or performance tools. Expensive visual features
  remain individually disableable.
- Distant Horizons and Xaero's maps run on both sides. DH generates and streams
  server-owned LOD data; Xaero's server components provide stable world IDs and
  rule enforcement. Ambercraft reapplies Xaero's documented fair-play signal
  whenever a player joins: surface mapping and waypoints remain available, but
  cave maps and entity radar are disabled on both Minimap and World Map.
- Jade remains on both sides for server-backed information. Jade Addons was
  removed because no important installed integration justified it.
- Spark is the server profiler. DH's `/dh pregen` replaces Chunky so one system
  owns full-chunk and LOD generation queues.

## Quark module decisions

Quark is retained because IDAS references its Abacus, Ancient Fruit, blossom
wood, Bottled Cloud, corundum family, Forgotten, gravisand, Iron Rod,
permafrost, Pickarang, seed pouch, stools, Torch Arrow, Trowel, Wraith, and
other content. Integrated Villages references bonded leather, shingles,
sandstone bricks, spruce chests, thatch, and vertical oak planks.

Consequently, broad Quark categories cannot be disabled without hollowing out
generated structures. The safe release-one overrides are:

- disabled: crab, Hollow Logs, Totem of Holding, pipes;
- disabled world placement: Big Stone Clusters, Fallen Logs, Nether Obsidian
  Spikes, New Stone Types, Spiral Spires, Chorus Vegetation;
- enabled: Backpack as the pack's deliberately limited expedition-storage
  system;
- retained: required blocks, tools, mobs, and biome resources;
- retained pending play: inventory conveniences, Matrix Enchanting, crate,
  magnet, and the remaining small tweaks.

## Loot audit and campaign use

The content mods contain hundreds of technical loot tables because every block,
entity, chest subtype, and optional integration may have its own table. The
release-relevant reward sources are:

- End Remastered's now-disabled vanilla injections: mineshafts, bastions, buried treasure,
  desert pyramids, igloos, jungle temples, Nether fortresses, outposts,
  shipwrecks, dungeons, mansions, Elder Guardians, Evokers, skeleton horses,
  witches, Withers, cleric trading, and enchanting;
- IDAS destination chests, especially Ancient Mines, Pillager Fortress,
  Necromancer's Spire, Labyrinth, Tinker's Citadel, Ruins of the Deep, ancient
  portals, museums, ships, and train ruins;
- Integrated Village profession and settlement chests;
- YUNG landmark-specific treasure tables;
- Alex's Caves biome ruins, underground cabins, Gingerbread Town, and
  Licowitch Tower;
- Mowzie boss drops and encounter chests;
- Artifacts' injected structure rewards;
- Incendium and End's Phantasm destination loot.

Ambercraft modifies only named campaign sources. It does not globally replace
complete loot tables, preserving mod-authored rewards and reducing compatibility
risk. Chest routes use Lootr; boss routes remain communal drops.

Eight signature modded treasure tables also reference Artifacts' existing
themed injection tables. This closes the main static reward gap: custom IDAS,
YUNG, Integrated Village, and Integrated Stronghold tables did not automatically
receive Artifacts' vanilla-structure injections. The nested tables preserve
Artifacts' original 15–45% rarity and environment-specific selection instead of
guaranteeing a Curio or creating an Ambercraft-only duplicate balance system.
Ordinary chests remain untouched.

No second trinket mod is included. Relics, Nameless Trinkets, More Artifacts,
and Dungeons Artifacts would add overlapping Curio inventories or separate
random-stat, leveling, active-ability, or soul-meter systems. Existing mods
already supply ample unique discoveries: Artifacts provides broad uncraftable
side-grades; Mowzie's Mobs supplies encounter powers; Alex's Caves supplies
biome-specific equipment and vehicles; Quark supplies rare oddities such as
Ancient Tomes and the Heart of Diamond path; Incendium and End's Phantasm
supply dimension-specific rewards.

The route graph remains intentionally forgiving: sixteen distinct eyes exist
for twelve portal frames. Ambercraft now owns every route; End Remastered's
default chest, entity, trade, enchanting, and recipe paths are disabled.
Frostmaw, Umvuthi, the Wither, and the Elder Guardian provide four optional
two-player campaign milestones, while the remaining routes support asynchronous
exploration and crafting. Static inspection found no need to raise Mowzie's
default health or damage: its encounters already heal out of combat and resist
respawn attrition, while their unusual rewards provide sufficient incentive.

IDAS contains powerful treasure, including small amounts of diamond equipment,
rare enchanted golden apples, and isolated Netherite scrap. Those rewards are
concentrated in major destinations such as Ancient Mines and the Labyrinth;
the disabled optional Dread Citadel tables do not generate. Incendium's
Infernal Wings do not bypass the End because the Hovering Inferno supplies an
upgrade component rather than an Elytra. These rewards remain a multiplayer
watch list, but do not justify a blanket loot nerf before anyone experiences
their actual frequency and encounter cost.

## Static density assessment

- Regular Integrated Villages now use a 48-chunk placement grid with 32 chunks
  of separation, rather than 26/19. This leaves roughly 768 blocks between grid
  opportunities before biome and exclusion checks and directly addresses the
  cluster of near-identical Mediterranean villages seen in the test world.
- IDAS common and small surface sets use 36/24 and 40/28 rather than 21/12 and
  26/20. The rare, ocean, underground, and Nether sets retain their more
  conservative authored spacing.
- YUNG landmarks mostly replace vanilla roles rather than adding parallel
  surface landmarks. Its small underground dungeons remain frequent, but its
  major boss and eye destinations range from 24 to 50 chunks of spacing.
- Mowzie's major structures use 25-chunk triangular placement and ten-chunk
  village/outpost exclusions where applicable. Frostmaw and Umvuthi therefore
  remain discoverable without becoming ordinary roadside encounters.
- Terralith's more frequent rubble and underground sets are small environmental
  details, not full villages or campaign dungeons. They were not widened because
  doing so would remove texture from otherwise quiet wilderness.

Integrated Villages' missing cabin `stables_bottom` pool is supplied with a
valid cabin foundation fallback. This neutralizes the Integrated API warning
and gives the affected connector terrain support instead of leaving the pool
unresolved. A generated cabin village still needs visual inspection because
the upstream mod contains no dedicated cabin stable foundation template.

## Removed or confirmed redundant

- Dynamic Trees family: visually and mechanically overrode Terralith forests.
- MineColonies family: parallel management game.
- Passable Foliage: undermined dense terrain and added collision ambiguity.
- Structory and CTOV: replaced by IDAS and Integrated Villages for release one.
- YUNG's Better Stronghold: replaced by Integrated Stronghold.
- Guard Villagers: unstable repeated config writes in the tested build.
- Just Enough Resources: failed on an Integrated Villages trade and spoiled
  discovery with unreliable generated-resource information.
- Immersive Weathering Tweaks and Quantified API: excessive native probing and
  operational cost.
- Every Compat, Mob Conversion, Jade Addons, KubeJS Create, YUNG's Bridges:
  removed in the first pruning pass.
- Friends & Foes: its remaining wildlife and copper-golem niche overlapped
  Alex's Mobs, Quark, and the pack's exploration systems.
- Quark Oddities: not installed. Static structure inspection found that IDAS
  and Integrated Villages use core Quark content, not Oddities' backpack,
  pipes, crates, magnets, or matrix enchanting systems.

## Questions that static analysis cannot answer

1. Whether large Integrated Villages are delightful more often than malformed.
2. Whether Better Caravans can navigate sustained Tectonic terrain.
3. Whether Mowzie boss difficulty and rewards fit the group's combat tolerance.
4. Whether the new eye clues and probabilities feel fair with Lootr.
5. Whether Nullscape and End's Phantasm produce a satisfying dragon approach.
6. Whether Embeddium Extra's raised vanilla cloud layer renders acceptably with
   Distant Horizons and shaders.

Those are the bounded release playtests. They are not reasons to add more mods
or redesign the pack before deployment.
