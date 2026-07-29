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

const AMBERCRAFT_LEDGER_QUESTS = {
  'endrem:old_eye': '1C00000000000001',
  'endrem:rogue_eye': '1C00000000000002',
  'endrem:nether_eye': '1C00000000000003',
  'endrem:cold_eye': '1C00000000000004',
  'endrem:magical_eye': '1C00000000000005',
  'endrem:black_eye': '1C00000000000006',
  'endrem:lost_eye': '1C00000000000007',
  'endrem:wither_eye': '1C00000000000008',
  'endrem:guardian_eye': '1C00000000000009',
  'endrem:cursed_eye': '1C0000000000000A',
  'endrem:exotic_eye': '1C0000000000000B',
  'endrem:evil_eye': '1C0000000000000C',
  'endrem:undead_eye': '1C0000000000000D',
  'endrem:cryptic_eye': '1C0000000000000E',
  'endrem:corrupted_eye': '1C0000000000000F',
  'endrem:witch_eye': '1C00000000000010'
}

const AMBERCRAFT_LEDGER_ENTRIES = [
  { count: 0, id: '1F00000000000000' },
  { count: 0, id: '2000000000000000' },
  { count: 0, id: '2000000000000010' },
  { count: 0, id: '2000000000000020' },
  { count: 0, id: '2000000000000030' },
  { count: 12, id: '1F0000000000000C' }
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

function completeLedgerQuest(server, player, questId) {
  const syncKey = `ambercraft_ledger_synced_${questId.toLowerCase()}`
  if (player.persistentData.getBoolean(syncKey)) return

  server.runCommandSilent(
    `ftbquests change_progress ${player.name.string} complete ${questId}`
  )
  player.persistentData.putBoolean(syncKey, true)
}

function syncExpeditionLedger(server, player) {
  const count = discoveredEyeCount(server)

  AMBERCRAFT_EYES.forEach(id => {
    if (server.persistentData.getBoolean(eyeKey(id))) {
      completeLedgerQuest(server, player, AMBERCRAFT_LEDGER_QUESTS[id])
    }
  })

  AMBERCRAFT_LEDGER_ENTRIES.forEach(entry => {
    if (count >= entry.count) completeLedgerQuest(server, player, entry.id)
  })
}

function awardBossMilestone(event, item, title) {
  const participants = nearbyPlayers(event.entity, 64)
  if (participants.length === 0) return

  // Put the unique campaign reward directly into a participant's inventory so
  // a Wither crater, fire, water current, or later explosion cannot erase it.
  participants[0].give(item)
  event.server.tell(Text.gold(`${title}: eye recovered.`))
}

ServerEvents.recipes(event => {
  event.remove({ id: 'endrem:exotic_eye' })
  event.remove({ id: 'endrem:undead_eye' })
  event.remove({ id: 'endrem:witch_eye' })

  // Integrated Villages supplies a limited number of recoverable toolboxes.
  // Treat them as useful settlement finds instead of an inexpensive,
  // infinitely craftable early substitute for expedition storage.
  event.remove({ id: 'create:crafting/curiosities/brown_toolbox' })

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

  // Sophisticated Storage is Ambercraft's stationary bulk-storage layer.
  // Its useful stack compression follows the same expedition milestones as
  // backpacks, but each storage block accepts only one stack upgrade through
  // the managed server config. The 32x and infinite tiers would erase the
  // practical scale of warehouses and Create logistics.
  ;[
    'sophisticatedstorage:stack_upgrade_tier_1_plus',
    'sophisticatedstorage:stack_upgrade_tier_2',
    'sophisticatedstorage:stack_upgrade_tier_3',
    'sophisticatedstorage:stack_upgrade_tier_4',
    'sophisticatedstorage:stack_upgrade_tier_5',
    'sophisticatedstorage:stack_upgrade_omega_tier',
    'sophisticatedstorage:infinity_upgrade',
    'sophisticatedstorage:survival_infinity_upgrade'
  ].forEach(id => event.remove({ output: id }))

  event.shaped('sophisticatedstorage:stack_upgrade_tier_2', [
    'GBG',
    'BSB',
    'GBG'
  ], {
    G: '#forge:storage_blocks/gold',
    B: 'minecraft:blaze_rod',
    S: 'sophisticatedstorage:stack_upgrade_tier_1'
  }).id('kubejs:living_world/nether_storage_stack_upgrade')

  event.shaped('sophisticatedstorage:stack_upgrade_tier_3', [
    'DTD',
    'TST',
    'DTD'
  ], {
    D: '#forge:storage_blocks/diamond',
    T: 'alexscaves:telecore',
    S: 'sophisticatedstorage:stack_upgrade_tier_2'
  }).id('kubejs:living_world/deep_storage_stack_upgrade')

  event.shaped('sophisticatedstorage:stack_upgrade_tier_4', [
    'NVN',
    'VSV',
    'NBN'
  ], {
    N: 'minecraft:netherite_ingot',
    V: 'phantasm:void_crystal_shard',
    B: 'minecraft:dragon_breath',
    S: 'sophisticatedstorage:stack_upgrade_tier_3'
  }).id('kubejs:living_world/end_storage_stack_upgrade')

  // Upgraded shulker boxes would duplicate the deliberately bounded backpack
  // progression. Automated cooking, collection, deletion, and fluid/XP
  // handling also duplicate Farmer's Delight and Create machinery while
  // adding always-active work to storage blocks.
  ;[
    'sophisticatedstorage:shulker_box',
    'sophisticatedstorage:copper_shulker_box',
    'sophisticatedstorage:iron_shulker_box',
    'sophisticatedstorage:gold_shulker_box',
    'sophisticatedstorage:diamond_shulker_box',
    'sophisticatedstorage:netherite_shulker_box',
    'sophisticatedstorage:feeding_upgrade',
    'sophisticatedstorage:advanced_feeding_upgrade',
    'sophisticatedstorage:magnet_upgrade',
    'sophisticatedstorage:advanced_magnet_upgrade',
    'sophisticatedstorage:pickup_upgrade',
    'sophisticatedstorage:advanced_pickup_upgrade',
    'sophisticatedstorage:void_upgrade',
    'sophisticatedstorage:advanced_void_upgrade',
    'sophisticatedstorage:smelting_upgrade',
    'sophisticatedstorage:auto_smelting_upgrade',
    'sophisticatedstorage:smoking_upgrade',
    'sophisticatedstorage:auto_smoking_upgrade',
    'sophisticatedstorage:blasting_upgrade',
    'sophisticatedstorage:auto_blasting_upgrade',
    'sophisticatedstorage:pump_upgrade',
    'sophisticatedstorage:advanced_pump_upgrade',
    'sophisticatedstorage:xp_pump_upgrade',
    'sophisticatedstorage:alchemy_upgrade',
    'sophisticatedstorage:advanced_alchemy_upgrade'
  ].forEach(id => event.remove({ output: id }))

  // Dense containers still need a logistics system. Remove Sophisticated
  // Storage's controller network so Create funnels, belts, tunnels, packagers,
  // stock links, and redstone remain the shared warehouse vocabulary.
  ;[
    'sophisticatedstorage:controller',
    'sophisticatedstorage:storage_link',
    'sophisticatedstorage:storage_io',
    'sophisticatedstorage:storage_input',
    'sophisticatedstorage:storage_output'
  ].forEach(id => event.remove({ output: id }))
  event.remove({ output: /sophisticatedstorage:.*storage_connector/ })

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

// Campaign boss rewards go directly to a nearby participant so explosions,
// fire, or water cannot erase the unique progression item.
EntityEvents.death('mowziesmobs:frostmaw', event => {
  awardBossMilestone(event, 'kubejs:rimebound_eye_shard', 'The Frostmaw')
})

EntityEvents.death('mowziesmobs:umvuthi', event => {
  awardBossMilestone(event, 'endrem:magical_eye', 'Umvuthi')
})

EntityEvents.death('minecraft:elder_guardian', event => {
  awardBossMilestone(event, 'endrem:guardian_eye', 'The Elder Guardian')
})

EntityEvents.death('minecraft:wither', event => {
  awardBossMilestone(event, 'endrem:wither_eye', 'The Wither')
})

// Cataclysm is an optional late-Nether route into the same campaign discovery
// as Incendium's Forbidden Castle. It can never add an extra distinct eye or
// make the End mandatory behind Cataclysm, but a prepared group has another
// way to earn the Cursed Eye.
EntityEvents.death('cataclysm:netherite_monstrosity', event => {
  awardBossMilestone(event, 'endrem:cursed_eye', 'The Netherite Monstrosity')
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
    Text.gold(`Expedition Ledger: ${event.item.displayName.string} recorded by ${event.player.name.string} (${count}/16).`)
  )
  event.server.players.forEach(player => {
    syncExpeditionLedger(event.server, player)
  })

  if (count === 12) {
    event.server.tell(
      Text.lightPurple('Twelve different eyes have been recorded. The stronghold can now be opened.')
    )
  }
})

// FTB Quests supplies the always-available UI, while KubeJS persistent data
// remains the authoritative world-wide record. Late joiners receive the same
// shared ledger after the quest data has finished syncing to their client.
PlayerEvents.loggedIn(event => {
  event.server.scheduleInTicks(40, () => {
    syncExpeditionLedger(event.server, event.player)
  })
})

ItemEvents.rightClicked('kubejs:expedition_ledger', event => {
  const count = discoveredEyeCount(event.server)
  let hint = 'Start close to home: villages, old temples, and abandoned mines.'

  if (count >= 3) hint = 'The easy leads are running thin. Try the deep caves, ocean monuments, and places touched by sculk.'
  if (count >= 6) hint = 'Check the Nether records and the notes about large creatures.'
  if (count >= 9) hint = 'The remaining routes are dangerous. Bring food, spare gear, and someone you trust.'
  if (count >= 12) hint = 'You have enough. Gather twelve different eyes and find the stronghold.'

  event.server.tell(Text.gold('Expedition Ledger'))
  event.server.tell(Text.gray(`The group has found ${count} of the 16 known eyes.`))
  event.server.tell(Text.aqua(hint))
})
