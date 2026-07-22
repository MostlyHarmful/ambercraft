# Progression prototype

This is the first playable campaign slice for Living World. It is intentionally
small enough to test before writing a large KubeJS ruleset.

## Campaign spine

Players should recover a configurable selection of End Remastered eyes through
different kinds of play. The campaign should move from inhabited places through
increasingly dangerous expeditions and culminate in Integrated Stronghold.

Provisional routes:

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
10. **Wild-card route:** allow one alternate eye from caravans, witch content,
    or another difficult structure so the campaign is not completely linear.

After the stronghold, the campaign shifts from collecting access keys to an End
expedition through Nullscape terrain and End's Phantasm content. The dragon
remains the recognizable vanilla climax for the first release; End exploration
and its rewards should provide the post-entry payoff without immediately adding
a second dragon or a separate boss ladder.

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

## First implementation slice

Implement and playtest only three altered routes first:

1. Integrated Village clue or trade.
2. Alex's Caves material-based eye recipe.
3. One Mowzie's Mobs drop used as an eye-repair ingredient.

Leave the other eyes at their defaults during this prototype. Once these three
routes work in multiplayer and feel understandable without a quest checklist,
expand the campaign incrementally.

### Implemented prototype

- Integrated Village cleric chests have a 35% chance to contain a Weathered Eye
  Chart. The chart is used with paper and an Eye of Ender to craft the Old Eye.
- Pure Darkness from Alex's Caves' Forlorn Hollows is used with obsidian, an
  Echo Shard, and an Eye of Ender to craft the Black Eye.
- Frostmaw drops a separate Rimebound Eye Shard in addition to its normal
  rewards. The shard is used with ice, snow, and an Eye of Ender to craft the
  Cold Eye.

These are alternate acquisition routes only. Default End Remastered routes
remain enabled until the prototype has passed client, Lootr, and multiplayer
gameplay testing.

The first boss prototype should use only one encounter. Frostmaw or Ferrous
Wroughtnaut are the leading candidates because they read as discoverable local
legends rather than a disconnected boss arena. Do not require every Mowzie's
Mobs boss, and do not require killing the Warden; alternate routes are part of
the campaign design.

## Implementation tools

- KubeJS for recipes, tags, and lightweight server logic.
- Datapacks for advancements, predicates, structure tags, and loot tables where
  they are clearer than scripts.
- Found books, maps, trades, and restrained advancement text for clues.
- Lootr testing for every modified container source.

Do not remove default End Remastered acquisition methods until replacement paths
have been verified in a disposable multiplayer world.
