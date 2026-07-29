# Ambercraft progression

This is the statically implemented campaign for the first Ambercraft release.
It uses End Remastered's sixteen possible eyes and twelve-frame portal, but
Ambercraft—not End Remastered's default loot injections—owns every acquisition
route. Players can choose routes and recover from an unlucky structure search.

## Campaign spine

Players should recover a configurable selection of End Remastered eyes through
different kinds of play. The campaign should move from inhabited places through
increasingly dangerous expeditions and culminate in Integrated Stronghold.

The implemented campaign covers:

1. **Village route:** obtain a clue, trade, or component from an Integrated
   Village rather than simply taking an eye from an ordinary chest.
2. **Temple route:** recover an eye from one of the YUNG temple overhauls.
3. **Underground route:** complete a YUNG mineshaft or difficult IDAS dungeon.
4. **Alex's Caves route:** craft or restore an eye with a cave-specific resource.
5. **Ocean route:** complete a YUNG ocean monument expedition.
6. **Ancient route:** overcome an Ancient City/Warden objective.
7. **Nether route:** explore a YUNG Nether fortress and obtain a unique component.
8. **Wither route:** use the first Wither kill as a late pre-End milestone.
9. **Legendary-creature route:** restore an eye with a component earned from a
   selected Mowzie's Mobs encounter. The boss drop should be an ingredient, not
   a finished eye, so the reward remains legible as part of the same campaign.
10. **Wild-card route:** allow one alternate eye from witch content,
    or another difficult structure so the campaign is not completely linear.

After the stronghold, the campaign shifts from collecting access keys to an End
expedition. YUNG's Better End Island gives the first dragon a purpose-built
arena and arrival without replacing its recognizable behavior. Nullscape and
End's Phantasm then make the outer End the post-entry exploration payoff.
Cataclysm's remaining encounters form optional late challenges rather than a
second mandatory campaign ladder.

The final required count should be lower than the number of available routes.
This preserves player choice and prevents a single unlucky structure search from
blocking the server.

## Reward rhythm

- Early expeditions should yield maps, clues, modest Artifacts, and backpack
  improvements.
- Midgame expeditions should grant specialized mobility, protection, or materials
  that enable more ambitious travel and infrastructure.
- Late pre-End objectives should provide the final eye components, not equipment
  that trivializes the stronghold and dragon.
- Create's basic machinery remains ungated. Only a few advanced communal tools
  may use exploration materials.
- Sophisticated Storage provides the shared warehouse layer. Ordinary storage
  tiers remain resource-gated in the familiar copper-to-Netherite sequence.
  Stack compression advances from 2x locally to 4x after a Nether expedition,
  8x after recovering an Alex's Caves Telecore, and 16x after the dragon and an
  outer-End expedition. The same milestones apply to backpacks, but storage
  blocks remain stationary and connect directly to Create logistics.
  Sophisticated Storage's controller network is unavailable: engineers still
  build the belts, funnels, tunnels, stock links, packagers, and redstone that
  make a warehouse operate.

## Shared campaign structure

The **Ambercraft Expedition Ledger** is the group's spoiler-light campaign
interface. It is available from the inventory quest button and does not need to
be crafted or carried. Its main chapter is presented as the surviving field
notes of an explorer who traced all sixteen Eye accounts but never finished the
route. Sixteen linked hints surround a large portal objective that accepts any
twelve completed dependencies, then leads onward to the stronghold, opened
portal, and dragon. Legacy physical Ledgers remain valid and report the same
count.

A second chapter, **Other Expeditions**, organizes optional content into rare
Alex's Caves regions, four linked Cataclysm site-and-boss expeditions, and
communal infrastructure. Each section explains how it is tracked and what kind
of preparation it expects. The chapter states plainly that these routes are
optional. This keeps major content visible without placing it in the critical
path or turning the pack into a checklist.

The first time any player carries a new eye, the server records that discovery
globally and announces it. This makes asynchronous exploration useful to
everyone without requiring every player to be online. Extra copies do not
increase the distinct-eye count and therefore do not accelerate the campaign.

Five campaign components come from major combat encounters:

- Frostmaw's Rimebound Eye Shard;
- Umvuthi's Magical Eye;
- the Elder Guardian's Guardian Eye;
- the Wither's Wither Eye;
- the Netherite Monstrosity's alternate Cursed Eye.

Each component is awarded to a living player within 64 blocks when the enemy
dies. Multiplayer coordination is encouraged socially and by the encounters'
difficulty rather than enforced by the reward script.

This division supports different interests without turning them into chores:

- explorers locate destinations, clues, and rare resources;
- combat players lead the four shared encounters;
- engineers build the Ledger, transport, expedition supplies, and the rail
  network that makes widely spaced routes practical;
- builders create the shared archive, stations, safe outposts, roads, storage,
  and social spaces that turn individual finds into communal infrastructure.

Only the first two roles have explicit eye drops. The latter two contribute
through persistent infrastructure rather than arbitrary "build this exact
machine or house" quest checks.

Cataclysm is deliberately optional before the End. Defeating the Netherite
Monstrosity supplies the same Cursed Eye available from
Incendium's Forbidden Castle, so it rewards an early hard challenge without
adding an extra distinct eye or blocking players who prefer exploration.

## Implemented routes

- Integrated Village cleric chests have a 35% chance to contain a Weathered Eye
  Chart. The chart is used with paper and an Eye of Ender to craft the Old Eye.
- Pure Darkness from Alex's Caves' Forlorn Hollows is used with obsidian, an
  Echo Shard, and an Eye of Ender to craft the Black Eye.
- Frostmaw yields a Rimebound Eye Shard when defeated. The
  shard is used with ice, snow, and an Eye of Ender to craft the Cold Eye.

Default End Remastered chest injections, entity drops, cleric trade, enchanting
route, and three built-in eye recipes are disabled. Ambercraft supplies these
routes:

| Eye or component | Ambercraft route | Role |
| --- | --- | --- |
| Old Eye | Weathered Eye Chart from an Integrated Village cleric chest, then craft | inhabited-world introduction |
| Rogue Eye | YUNG's Better Jungle Temple treasure | temple expedition |
| Lost Eye | IDAS Ancient Mines Create chest | underground engineering |
| Corrupted Eye | IDAS Pillager Fortress library | hostile civilization |
| Black Eye | Pure Darkness from Alex's Caves' Forlorn Hollows, then craft | rare cave expedition |
| Cold Eye | Rimebound Eye Shard from Frostmaw, then craft | legendary creature |
| Guardian Eye | Elder Guardian defeated | ocean boss |
| Witch Eye | YUNG's Better Witch Hut chest | occult exploration |
| Nether Eye | YUNG's Better Nether Fortress worship chest | Nether expedition |
| Exotic Eye | YUNG's Better Ocean Monument upper chamber | alternate ocean route |
| Cryptic Eye | Ancient City chest | Deep Dark expedition without mandatory Warden kill |
| Undead Eye | IDAS Necromancer's Spire soul, then craft with vanilla undead/Nether materials | supernatural structure and fabrication |
| Magical Eye | Umvuthi defeated | major legendary boss |
| Cursed Eye | the king statue within Incendium's Forbidden Castle | major Nether destination |
| Wither Eye | Wither defeated | late pre-End vanilla boss |
| Evil Eye | rare treasure in an Integrated Village airship | high-altitude settlement expedition |

The landmark routes in the table are guaranteed in their named signature chest
unless a probability is stated explicitly. The Village Chart and Ancient City
Cryptic Eye remain 35% rolls because each can be attempted across many ordinary
containers. At twelve recorded resonances, the Ledger announces that the group
can gather its collection and seek the stronghold.

Each eye now has a restrained tooltip clue. These clues identify a kind of
place or challenge without exposing coordinates or presenting a quest checklist.
The Undead Soul carries its own clue as well, so the intermediate item found in
the Necromancer's Spire is understandable before it is crafted into an eye.

The resulting balance is choice-driven rather than a boss rush: the portal has
twelve frames and the campaign offers sixteen eyes. Players can pursue combat,
structures, crafting, settlement exploration, or dangerous-biome exploration
and skip four routes that do not appeal to the group.

Frostmaw and Umvuthi are the only added bosses with explicit eye routes. Ferrous
Wroughtnaut, Sculptor, and the remaining Mowzie's encounters remain optional
discoveries. The Warden is not a mandatory kill: the Cryptic Eye is found in an
Ancient City chest and can also be skipped in favor of another eye.

## Loot and power policy

Lootr intentionally individualizes ordinary structure containers, including
the Ambercraft chest-route roll. This prevents one early explorer from erasing
a destination for everyone else. It does not multiply campaign speed: only the
first copy of each distinct eye changes the global Ledger, and twelve different
eyes—not twelve total items—are required.

Boss milestones are ordinary shared world drops and are not individualized.
Major communal finds should be stored or displayed centrally. Common expedition
resources, Create materials, building supplies, food, potions, and equipment
remain ordinary shared logistics; the campaign does not magically duplicate
them.

Static inspection found powerful rewards in the expected high-risk locations:
IDAS can very rarely produce enchanted golden apples, diamond equipment, and
isolated Netherite scrap in major dungeons; Incendium has bespoke weapons and
an Infernal Feather earned from its Hovering Inferno, but upgrading it to
Infernal Wings still requires an Elytra. Mowzie's rewards are capability-rich,
but come from persistent bosses that heal when encounters are abandoned.
These are watch-list rewards, not clear early-game bypasses, so their authored
loot remains intact for the first multiplayer test.

The release rule is to nerf a reward only when it skips an entire meaningful
tier, is repeatably farmable too early, or makes another major system obsolete.
Rare, specialized, side-grade discoveries are part of Ambercraft's intended fun.

Artifacts supplies roughly forty-five uncraftable Curios with movement,
survival, exploration, or situational combat abilities. Rather than install a
second overlapping trinket progression, Ambercraft bridges Artifacts' own themed
loot pools into eight signature modded treasure tables:

- the Better Jungle Temple;
- IDAS Ancient Mines;
- the IDAS Pillager Fortress library;
- the Better Nether Fortress worship chamber;
- the Better Ocean Monument upper chamber;
- the IDAS Necromancer's Spire;
- the Integrated Village airship treasure;
- the Integrated Stronghold treasure chamber.

These are nested references to Artifacts' authored pools, not guaranteed item
drops. Their original per-table chances remain intact (between 15% and 45%),
and the available items match the destination: mining and darkness tools in
mines, aquatic tools in monuments, Nether-oriented finds in fortresses, and so
on. Ordinary village and dungeon chests are excluded to avoid Curio saturation.
Lootr gives each player a fair independent opportunity, while the uncertain roll
preserves reasons to explore more than one destination.

Mowzie's Mobs, Alex's Caves, Incendium, Quark, and End's Phantasm keep their
unique items attached to their intended creatures, biomes, and encounters.
Moving those rewards into generic chests would make the original content
optional in the wrong way. Relics, Nameless Trinkets, More Artifacts, and
Dungeons Artifacts are not included in release one because their extra stat,
leveling, soul-meter, or large Curio systems overlap Artifacts and would make
the pack's power curve harder to read.

## Spoiler policy

- End Remastered's advancement tab is replaced with invisible, impossible
  criteria so it cannot reveal every route.
- All eyes and intermediate eye components are hidden from JEI. They still work,
  retain their clue tooltips when found, and can be crafted normally.
- Structure-discovery advancement toasts and global announcements remain
  suppressed; their tabs may still record exploration quietly.
- The Ledger gives phase-level guidance, while item tooltips provide the more
  specific clue only after a relevant item is encountered.
- No guide item is forced into a player's inventory on login.

## Remaining validation boundary

Static validation can prove that item IDs, loot-table IDs, recipes, scripts,
and datapacks load. It cannot prove that a 35 or 50 percent Lootr roll feels
fair, that four shared encounters are enjoyable, or that the Ledger clues are
discoverable without becoming obvious. If testing exposes a blocked route,
restore only the specific End Remastered fallback needed; do not silently
restore every default route.

## Implementation tools

- KubeJS for recipes, tags, and lightweight server logic.
- Datapacks for advancements, predicates, structure tags, and loot tables where
  they are clearer than scripts.
- Found books, maps, trades, and restrained advancement text for clues.
- Lootr testing for every modified container source.

## Communal enchanting

Create: Enchantment Industry gives engineering-focused players a useful
midgame contribution without making an enchanting factory an eye prerequisite.
The workshop can collect liquid experience, enchant ordinary equipment, mend
gear that has already earned Mending, and print schedules or written records
for the group. Hyper-enchanting is disabled and enchanted books cannot be
practically copied, so explorers still bring home the rare enchantments and
Ancient Tomes that make the workshop valuable.
