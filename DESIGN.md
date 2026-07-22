# Ambercraft design brief

This document is the decision standard for mod selection, configuration,
world generation, loot, and KubeJS work. A mod being good in isolation is not
enough; it must strengthen the experience described here.

## Core promise

Ambercraft is a recognizable Minecraft world that feels larger, older, and
less centered on the player. It emphasizes exploration, environmental change,
rare discoveries, inhabited places, and infrastructure built by friends. It is
not a kitchen-sink pack, a colony-management game, or a mandatory factory
progression pack.

The desired loop is:

> Discover a clue, prepare for a distinct hazard, undertake an expedition,
> return with a capability or shared resource, and use it to reach or build
> something that was previously impractical.

This is inspired by the progression of Subnautica, not specifically its ocean
setting. A discovery should ideally change what players can do, where they can
go, how safely they can travel, or what the group can build. More scenery alone
does not constitute progression.

## Design principles

### The world is an actor

Prefer systems that create activity outside direct player control: seasons,
lunar events, weathering, caravans, village defense, reactive enemies, wildlife,
and physical traces of travel. These should produce comprehensible situations,
not constant random noise or destructive chores.

### Exploration must have consequences

Structures and unusual biomes need differentiated hazards, clues, loot, or
resources. Avoid filling every destination with interchangeable diamonds and
generic chest loot. Rare finds should support personal capabilities or unlock
communal infrastructure.

### End Remastered is the campaign spine

The route to the End should connect the pack's major environments and challenges.
KubeJS, loot changes, recipes, advancements, trades, and found clues may move or
reconstruct selected eyes. The result should offer several expedition chapters,
not a flat checklist of sixteen chest locations.

Require a meaningful selection of eyes rather than forcing every possible eye.
Use Integrated Stronghold as the culminating pre-End expedition. Preserve
mystery through clues and discoveries instead of a large visible quest book.

Reaching the End must feel like the beginning of a final expedition rather than
the campaign immediately running out of content. Nullscape supplies its strange,
vertical geography; End's Phantasm supplies ecology, structures, hazards, and
rewards. Incendium gives the Nether route comparable depth without replacing
the recognizable Nether or YUNG's fortress role.

### Integration beats volume

The current structure roles are intentionally distinct:

- Integrated Villages supplies inhabited settlements that use the pack's block
  and mechanical vocabulary.
- IDAS supplies original, mod-integrated adventure destinations.
- YUNG's suite improves specific vanilla landmarks.
- Alex's Caves supplies rare biome-scale expeditions with unique mechanics.

Structure density must leave substantial wilderness between destinations.
Adding another structure mod should normally replace an existing role rather
than create another overlapping layer.

### Create is infrastructure, not homework

Create, Copycats+, and Steam 'n' Rails support trains, building, and shared
projects. Basic Create components should remain accessible. Exploration may gate
a small number of advanced or communal capabilities, but nobody should be forced
through a factory progression merely to participate in ordinary play.

Instant universal travel should be avoided because it undermines geography,
roads, outposts, backpacks, and railways.

### Multiplayer must respect uneven attendance

Players will participate at different frequencies and pursue different goals.
Lootr and corpse recovery keep exploration viable for occasional players.
Progression should combine personal rewards with shared discoveries without
allowing the earliest explorer to permanently exhaust the nearby world.

Late joiners should not be trapped by global difficulty or time-based systems
balanced around established players.

### Minecraft remains legible

Vanilla-plus does not mean visually unchanged, but blocks, creatures, villages,
and mechanics should still read as belonging to Minecraft. Dramatic combat or
boss mods require a higher standard: their rewards must not trivialize the rest
of the pack, and their encounters should occupy a deliberate progression tier.

Self-contained dimensions, management simulations, class systems, and large RPG
equipment ladders are poor fits unless they are clearly connected to the main
world and replace equivalent content rather than sit beside it.

## Configuration standards

- Begin with conservative event, spread, detection, and transformation rates.
- Prefer memorable rare events over frequent interruptions.
- Soften or disable seasonal crop failure for irregular players.
- Prevent roads and weathering from rapidly damaging deliberate builds.
- Keep Zombie Awareness detection local enough to avoid endless pathfinding.
- Make Distant Horizons and other expensive visual systems optional client mods.
- Keep large decorative families discoverable through their own workstations or
  interfaces instead of listing thousands of near-identical variants in JEI.
- Test Integrated Villages and IDAS on steep Terralith/Tectonic terrain.
- Pregenerate only after worldgen and structure configuration is final.
- Profile settlement activity, simultaneous exploration, and lunar-event combat
  separately with spark.

## Addition test

Before adding a mod, answer all of these:

1. What distinct player experience or world behavior does it add?
2. Which existing mod or vanilla system does it integrate with?
3. What progression role, if any, will it serve?
4. Does it duplicate an existing structure, block, mob, or convenience role?
5. Does it preserve wilderness, mystery, and Minecraft's visual language?
6. What ongoing server, client, worldgen, AI, or configuration cost does it add?
7. Would the pack be more coherent if this replaced something instead?

If those answers are weak, do not add it.

## Current boundaries

- Dynamic Trees was removed after world testing; Terralith's vegetation is the
  intended baseline.
- MineColonies is outside the current direction because it creates a parallel
  management game rather than autonomous world activity.
- CTOV and Structory were replaced by Integrated Villages and IDAS to reduce
  overlapping structure roles and improve cross-mod visual integration.
- Cataclysm is not a default assumption. If adopted, use at most one carefully
  chosen boss before the End and reserve its larger power curve for later play.
- KubeJS exists to provide restrained connective tissue, not hundreds of recipe
  changes or compulsory task chains.
