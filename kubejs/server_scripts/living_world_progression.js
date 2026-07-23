// Ambercraft's campaign owns End Remastered acquisition. The mod's default
// loot injections, trades, enchanting route, and recipes are disabled by the
// accompanying data/config overrides.

const AMBERCRAFT_EYES = [
  'endrem:old_eye',
  'endrem:rogue_eye',
  'endrem:nether_eye',
  'endrem:cold_eye',
  'endrem:magical_eye',
  'endrem:black_eye',
  'endrem:lost_eye',
  'endrem:wither_eye',
  'endrem:guardian_eye',
  'endrem:cursed_eye',
  'endrem:exotic_eye',
  'endrem:evil_eye',
  'endrem:undead_eye',
  'endrem:cryptic_eye',
  'endrem:corrupted_eye',
  'endrem:witch_eye'
]

function eyeKey(id) {
  return `ambercraft_eye_${id.split(':')[1]}`
}

function discoveredEyeCount(server) {
  let count = 0
  AMBERCRAFT_EYES.forEach(id => {
    if (server.persistentData.getBoolean(eyeKey(id))) count++
  })
  return count
}

function nearbyPlayers(entity, radius) {
  const radiusSquared = radius * radius
  return entity.level.players.filter(player =>
    !player.isSpectator() && player.isAlive() && player.distanceToSqr(entity) <= radiusSquared
  )
}

function awardSharedBossMilestone(event, item, title) {
  const participants = nearbyPlayers(event.entity, 64)

  if (participants.length < 2) {
    event.server.tell(
      Text.gold(`${title} was overcome, but its campaign secret did not resonate.`)
    )
    event.server.tell(
      Text.gray('Return with an ally nearby when facing this foe to claim that shared milestone.')
    )
    return
  }

  // Put the unique campaign reward directly into a participant's inventory so
  // a Wither crater, fire, water current, or later explosion cannot erase it.
  participants[0].give(item)
  event.server.tell(
    Text.gold(`Shared milestone: ${title} fell before ${participants.length} companions.`)
  )
}

ServerEvents.recipes(event => {
  event.remove({ id: 'endrem:exotic_eye' })
  event.remove({ id: 'endrem:undead_eye' })
  event.remove({ id: 'endrem:witch_eye' })

  event.shaped('kubejs:expedition_ledger', [
    'MCP',
    'LBL',
    'PIP'
  ], {
    M: 'minecraft:map',
    C: 'minecraft:compass',
    P: 'minecraft:paper',
    L: 'minecraft:leather',
    B: 'minecraft:book',
    I: 'minecraft:ink_sac'
  }).id('kubejs:living_world/expedition_ledger')

  event.shaped('endrem:old_eye', [
    'PPP',
    'PEP',
    'PCP'
  ], {
    P: 'minecraft:paper',
    E: 'minecraft:ender_eye',
    C: 'kubejs:weathered_eye_chart'
  }).id('kubejs:living_world/old_eye_from_village_chart')

  event.shaped('endrem:black_eye', [
    'ODO',
    'DED',
    'OSO'
  ], {
    O: 'minecraft:obsidian',
    D: 'alexscaves:pure_darkness',
    E: 'minecraft:ender_eye',
    S: 'minecraft:echo_shard'
  }).id('kubejs:living_world/black_eye_from_forlorn_hollows')

  event.shaped('endrem:cold_eye', [
    'BRB',
    'SES',
    'BIB'
  ], {
    B: 'minecraft:blue_ice',
    I: 'minecraft:packed_ice',
    R: 'kubejs:rimebound_eye_shard',
    S: 'minecraft:snow_block',
    E: 'minecraft:ender_eye'
  }).id('kubejs:living_world/cold_eye_from_frostmaw')

  event.shaped('endrem:undead_eye', [
    'BGB',
    'PEP',
    'BSB'
  ], {
    B: 'minecraft:bone',
    G: 'minecraft:ghast_tear',
    P: 'minecraft:phantom_membrane',
    E: 'minecraft:ender_eye',
    S: 'endrem:undead_soul'
  }).id('kubejs:living_world/undead_eye_from_necromancer_soul')

  // Farmer's Delight turns the intentionally rare Alex's Mobs fly into
  // atmosphere rather than a required farm. Spoiled produce can occasionally
  // supply a maggot, while natural flies remain the direct source.
  event.custom({
    type: 'farmersdelight:cutting',
    ingredients: [
      { item: 'farmersdelight:rotten_tomato' }
    ],
    tool: {
      tag: 'forge:tools/knives'
    },
    result: [
      { item: 'farmersdelight:tomato_seeds' },
      { item: 'alexsmobs:maggot', chance: 0.35 }
    ]
  }).id('kubejs:living_world/maggot_from_spoiled_produce')
})

LootJS.modifiers(event => {
  function addThemedArtifactPool(targetTable, artifactTable) {
    event.addLootTableModifier(targetTable).addLoot(
      LootEntry.ofJson({
        type: 'minecraft:loot_table',
        name: artifactTable
      })
    )
  }

  const integratedVillageClericTables = [
    'integrated_villages:chests/airship_village/airship_village_cleric',
    'integrated_villages:chests/cabin_village/cabin_village_cleric',
    'integrated_villages:chests/clockwork_village/clockwork_village_cleric',
    'integrated_villages:chests/kutcha_village/kutcha_village_cleric',
    'integrated_villages:chests/marketstead_village/marketstead_village_cleric',
    'integrated_villages:chests/minka_village/minka_village_cleric',
    'integrated_villages:chests/mossy_mounds/mossy_mounds_cleric',
    'integrated_villages:chests/oasis_village/oasis_village_cleric',
    'integrated_villages:chests/pirate_village/pirate_village_cleric'
  ]

  integratedVillageClericTables.forEach(table => {
    event.addLootTableModifier(table).addLoot(
      LootEntry.of('kubejs:weathered_eye_chart')
        .when(condition => condition.randomChance(0.35))
    )
  })

  // Integrated Villages already contains a Farmer's Delight shop in its swamp
  // settlement. Light-touch loot bridges make the remaining village styles
  // participate without flooding each per-player Lootr chest with food.
  const integratedVillageFarmhouses = [
    'airship_village',
    'cabin_village',
    'clockwork_village',
    'kutcha_village',
    'marketstead_village',
    'mediterranean_village',
    'minka_village',
    'mossy_mounds',
    'oasis_village',
    'pirate_village',
    'swamp_village',
    'tavern_village'
  ]

  integratedVillageFarmhouses.forEach(village => {
    const table = `integrated_villages:chests/${village}/${village}_farmhouse`
    event.addLootTableModifier(table)
      .addLoot(
        LootEntry.of('farmersdelight:cabbage_seeds')
          .when(condition => condition.randomChance(0.18))
      )
      .addLoot(
        LootEntry.of('farmersdelight:tomato_seeds')
          .when(condition => condition.randomChance(0.18))
      )
      .addLoot(
        LootEntry.of('farmersdelight:rice')
          .when(condition => condition.randomChance(0.12))
      )
  })

  event.addLootTableModifier('idas:chests/bearclaw_inn/bearclaw_inn_food')
    .addLoot(
      LootEntry.of('farmersdelight:roast_chicken')
        .when(condition => condition.randomChance(0.25))
    )

  // Landmark routes make the installed structure overhauls part of the same
  // campaign. Lootr gives each player an independent roll from these chests.
  event.addLootTableModifier('betterjungletemples:chests/treasure')
    .addLoot('endrem:rogue_eye')

  event.addLootTableModifier('idas:chests/ancient_mines/minescreate')
    .addLoot('endrem:lost_eye')

  event.addLootTableModifier('idas:chests/pillager_fortress/pillager_library')
    .addLoot('endrem:corrupted_eye')

  event.addLootTableModifier('betterwitchhuts:chests/hut_0')
    .addLoot('endrem:witch_eye')

  event.addLootTableModifier('betterfortresses:chests/worship')
    .addLoot('endrem:nether_eye')

  event.addLootTableModifier('betteroceanmonuments:chests/upper_side_chamber')
    .addLoot('endrem:exotic_eye')

  event.addLootTableModifier('minecraft:chests/ancient_city')
    .addLoot(
      LootEntry.of('endrem:cryptic_eye')
        .when(condition => condition.randomChance(0.35))
    )

  event.addLootTableModifier('idas:chests/necromancers_spire/necromancers_spire')
    .addLoot('endrem:undead_soul')

  event.addLootTableModifier(
    'integrated_villages:chests/airship_village/airship_village_treasure'
  ).addLoot('endrem:evil_eye')

  event.addLootTableModifier('incendium:castle/king_statue')
    .addLoot('endrem:cursed_eye')

  // Artifacts already balances its discoveries by structure type and rarity.
  // Reuse those authored pools in a small number of modded landmark treasures
  // so they can yield a memorable capability instead of another generic ingot
  // stack. The referenced tables retain their own 15–45% chance; no artifact
  // is guaranteed, and ordinary/profession chests are deliberately excluded.
  const themedArtifactBridges = [
    [
      'betterjungletemples:chests/treasure',
      'artifacts:inject/chests/jungle_temple'
    ],
    [
      'idas:chests/ancient_mines/minescreate',
      'artifacts:inject/chests/abandoned_mineshaft'
    ],
    [
      'idas:chests/pillager_fortress/pillager_library',
      'artifacts:inject/chests/pillager_outpost'
    ],
    [
      'betterfortresses:chests/worship',
      'artifacts:inject/chests/nether_bridge'
    ],
    [
      'betteroceanmonuments:chests/upper_side_chamber',
      'artifacts:inject/chests/underwater_ruin_big'
    ],
    [
      'idas:chests/necromancers_spire/necromancers_spire',
      'artifacts:inject/chests/ancient_city'
    ],
    [
      'integrated_villages:chests/airship_village/airship_village_treasure',
      'artifacts:inject/chests/buried_treasure'
    ],
    [
      'integrated_stronghold:chests/treasure',
      'artifacts:inject/chests/stronghold_corridor'
    ]
  ]

  themedArtifactBridges.forEach(bridge => {
    addThemedArtifactPool(bridge[0], bridge[1])
  })
})

// These four rewards are deliberately synchronous milestones. Defeating the
// encounter solo still grants every normal mod reward; only the campaign
// component asks for an ally within 64 blocks.
EntityEvents.death('mowziesmobs:frostmaw', event => {
  awardSharedBossMilestone(event, 'kubejs:rimebound_eye_shard', 'The Frostmaw')
})

EntityEvents.death('mowziesmobs:umvuthi', event => {
  awardSharedBossMilestone(event, 'endrem:magical_eye', 'Umvuthi')
})

EntityEvents.death('minecraft:elder_guardian', event => {
  awardSharedBossMilestone(event, 'endrem:guardian_eye', 'The Elder Guardian')
})

EntityEvents.death('minecraft:wither', event => {
  awardSharedBossMilestone(event, 'endrem:wither_eye', 'The Wither')
})

// Any eye reaching any player's inventory becomes a shared discovery exactly
// once per world. This records asynchronous work without forcing all players
// to be online for ordinary exploration.
PlayerEvents.inventoryChanged(event => {
  const id = `${event.item.id}`
  if (!AMBERCRAFT_EYES.includes(id)) return

  const key = eyeKey(id)
  if (event.server.persistentData.getBoolean(key)) return

  event.server.persistentData.putBoolean(key, true)
  const count = discoveredEyeCount(event.server)
  event.server.tell(
    Text.gold(`The Expedition Ledger records a new resonance (${count}/16 discovered).`)
  )
  event.server.tell(
    Text.gray(`${event.player.name.string} recovered ${event.item.displayName.string}.`)
  )

  if (count === 12) {
    event.server.tell(
      Text.lightPurple('Twelve distinct resonances are known. Secure the eyes, gather the group, and seek the stronghold.')
    )
  }
})

ItemEvents.rightClicked('kubejs:expedition_ledger', event => {
  const count = discoveredEyeCount(event.server)
  let hint = 'Begin with inhabited places, old temples, and forgotten mines.'

  if (count >= 3) hint = 'The trail now descends: deep caves, drowned monuments, and ancient darkness.'
  if (count >= 6) hint = 'Look beyond safe roads. The Nether and legendary creatures hold stronger resonances.'
  if (count >= 9) hint = 'Some remaining milestones answer only when companions face danger together.'
  if (count >= 12) hint = 'Enough paths are known. Find the stronghold and choose twelve distinct eyes.'

  event.player.tell(Text.gold('Ambercraft Expedition Ledger'))
  event.player.tell(Text.gray(`${count} of 16 possible resonances have been recorded across this world.`))
  event.player.tell(Text.aqua(hint))
})
