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
      Text.gold(`${title} is down, but whatever it was guarding is still dormant.`)
    )
    event.server.tell(
      Text.gray('Come back with a friend and finish the fight together.')
    )
    return
  }

  // Put the unique campaign reward directly into a participant's inventory so
  // a Wither crater, fire, water current, or later explosion cannot erase it.
  participants[0].give(item)
  event.server.tell(
    Text.gold(`${title} fell with ${participants.length} adventurers in the fight. Something new was recovered.`)
  )
}

ServerEvents.recipes(event => {
  event.remove({ id: 'endrem:exotic_eye' })
  event.remove({ id: 'endrem:undead_eye' })
  event.remove({ id: 'endrem:witch_eye' })

  // Enchantment Industry is a shared workshop, not a treasure-duplication
  // machine. Hyper Experience is the route used for above-cap enchanting and
  // Quark Ancient Tome printing, so Ambercraft removes its production recipe.
  event.remove({ id: 'create_enchantment_industry:mixing/hyper_experience' })

  // Sophisticated Backpacks supports expeditions and Create contraptions, but
  // it should not become nested, near-limitless portable storage. Inception
  // and Omega remain unavailable; upper stack tiers become shared milestones
  // tied to the Nether, Alex's Caves, and the post-dragon End.
  ;[
    'sophisticatedbackpacks:inception_upgrade',
    'sophisticatedbackpacks:stack_upgrade_tier_2',
    'sophisticatedbackpacks:stack_upgrade_tier_3',
    'sophisticatedbackpacks:stack_upgrade_tier_4',
    'sophisticatedbackpacks:stack_upgrade_omega_tier',
    'sophisticatedbackpacks:mob_catcher_upgrade',
    'sophisticatedbackpacks:advanced_mob_catcher_upgrade',
    'sophisticatedbackpacks:feeding_upgrade',
    'sophisticatedbackpacks:advanced_feeding_upgrade'
  ].forEach(id => event.remove({ id: id }))

  event.shaped('sophisticatedbackpacks:stack_upgrade_tier_2', [
    'GBG',
    'BSB',
    'GBG'
  ], {
    G: '#forge:storage_blocks/gold',
    B: 'minecraft:blaze_rod',
    S: 'sophisticatedbackpacks:stack_upgrade_tier_1'
  }).id('kubejs:living_world/nether_stack_upgrade')

  event.shaped('sophisticatedbackpacks:stack_upgrade_tier_3', [
    'DTD',
    'TST',
    'DTD'
  ], {
    D: '#forge:storage_blocks/diamond',
    T: 'alexscaves:telecore',
    S: 'sophisticatedbackpacks:stack_upgrade_tier_2'
  }).id('kubejs:living_world/deep_expedition_stack_upgrade')

  event.shaped('sophisticatedbackpacks:stack_upgrade_tier_4', [
    'NVN',
    'VSV',
    'NBN'
  ], {
    N: 'minecraft:netherite_ingot',
    V: 'phantasm:void_crystal_shard',
    B: 'minecraft:dragon_breath',
    S: 'sophisticatedbackpacks:stack_upgrade_tier_3'
  }).id('kubejs:living_world/end_stack_upgrade')

  // Supplementaries supplies Ambercraft's general-purpose rope. Farmer's
  // Delight keeps its useful rope fences and safety nets, but their recipes
  // now use the same material instead of adding a second interchangeable item.
  ;[
    'farmersdelight:rope',
    'farmersdelight:rope_from_safety_net',
    'farmersdelight:rope_fence',
    'farmersdelight:rope_fence_gate',
    'farmersdelight:safety_net'
  ].forEach(id => event.remove({ id: id }))

  event.shaped('4x supplementaries:rope', [
    'SS',
    'SS'
  ], {
    S: 'farmersdelight:straw'
  }).id('kubejs:living_world/supplementaries_rope_from_straw')

  event.shapeless('4x supplementaries:rope', [
    'farmersdelight:safety_net'
  ]).id('kubejs:living_world/rope_from_safety_net')

  event.shaped('3x farmersdelight:rope_fence', [
    'RSR',
    'RSR'
  ], {
    R: 'supplementaries:rope',
    S: '#forge:rods/wooden'
  }).id('kubejs:living_world/rope_fence')

  event.shaped('farmersdelight:rope_fence_gate', [
    'SRS',
    'SRS'
  ], {
    R: 'supplementaries:rope',
    S: '#forge:rods/wooden'
  }).id('kubejs:living_world/rope_fence_gate')

  event.shaped('3x farmersdelight:safety_net', [
    'RRR',
    'RRR'
  ], {
    R: 'supplementaries:rope'
  }).id('kubejs:living_world/safety_net')

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
  // Infinite food trivializes expeditions and Farmer's Delight. Artifacts
  // remains the source of capability-changing treasure, but this one reward
  // is removed from both chests and mobs.
  event.addLootTypeModifier('chest')
    .removeLoot('artifacts:everlasting_beef')
    .removeLoot('artifacts:eternal_steak')
  event.addLootTypeModifier('entity')
    .removeLoot('artifacts:everlasting_beef')
    .removeLoot('artifacts:eternal_steak')

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
    Text.gold(`A new eye has been added to the Expedition Ledger (${count}/16).`)
  )
  event.server.tell(
    Text.gray(`${event.player.name.string} found ${event.item.displayName.string}.`)
  )

  if (count === 12) {
    event.server.tell(
      Text.lightPurple('The Ledger holds enough eyes to open the way. Bring them together and start looking for the stronghold.')
    )
  }
})

ItemEvents.rightClicked('kubejs:expedition_ledger', event => {
  const count = discoveredEyeCount(event.server)
  let hint = 'Start close to home: villages, old temples, and abandoned mines.'

  if (count >= 3) hint = 'The easy leads are running thin. Try the deep caves, ocean monuments, and places touched by sculk.'
  if (count >= 6) hint = 'The next clues lie beyond safe roads—in the Nether and with creatures people know better than to wake.'
  if (count >= 9) hint = 'A few of the remaining prizes will only yield to a group. Bring food, spare gear, and someone you trust.'
  if (count >= 12) hint = 'You have enough. Gather twelve different eyes and find the stronghold.'

  event.player.tell(Text.gold('Expedition Ledger'))
  event.player.tell(Text.gray(`The group has found ${count} of the 16 known eyes.`))
  event.player.tell(Text.aqua(hint))
})
