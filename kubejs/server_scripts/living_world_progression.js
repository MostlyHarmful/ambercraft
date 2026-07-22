// The first Living World progression prototype deliberately adds alternate
// End Remastered routes without removing any default acquisition method.

ServerEvents.recipes(event => {
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
})

LootJS.modifiers(event => {
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

  event.addEntityLootModifier('mowziesmobs:frostmaw')
    .addLoot('kubejs:rimebound_eye_shard')
})
