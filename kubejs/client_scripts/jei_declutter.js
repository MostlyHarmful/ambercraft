// Chipped exposes its decorative variants through six dedicated workstations.
// Listing every variant separately adds almost seven thousand JEI ingredients,
// so keep the entry points visible and let the workstations serve as the catalog.
JEIEvents.hideItems(event => {
  event.hide(
    /chipped:(?!(alchemy_bench|botanist_workbench|carpenters_table|loom_table|mason_table|tinkering_table)$).+/
  )

  // End Remastered is Ambercraft's mystery campaign, not a JEI checklist.
  // Recovered eyes remain fully usable and retain their in-world tooltips.
  ;[
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
    'endrem:witch_eye',
    'endrem:undead_soul',
    'endrem:witch_pupil',
    'kubejs:weathered_eye_chart',
    'kubejs:rimebound_eye_shard'
  ].forEach(item => event.hide(item))

  // Supplementaries owns the pack's general-purpose rope. Farmer's Delight
  // fences and safety nets accept it through Ambercraft's replacement recipes.
  event.hide('farmersdelight:rope')

  // These two upgrades are intentionally outside Ambercraft's progression:
  // recursive bags and effectively limitless stacks undermine expeditions.
  event.hide('sophisticatedbackpacks:inception_upgrade')
  event.hide('sophisticatedbackpacks:stack_upgrade_omega_tier')
  event.hide('sophisticatedbackpacks:mob_catcher_upgrade')
  event.hide('sophisticatedbackpacks:advanced_mob_catcher_upgrade')
  event.hide('sophisticatedbackpacks:feeding_upgrade')
  event.hide('sophisticatedbackpacks:advanced_feeding_upgrade')

  // Stationary storage keeps its manual, organizational, compression, and
  // Create-integration tools. Portable storage variants and autonomous
  // machine upgrades are outside Ambercraft's storage progression.
  ;[
    'sophisticatedstorage:shulker_box',
    'sophisticatedstorage:copper_shulker_box',
    'sophisticatedstorage:iron_shulker_box',
    'sophisticatedstorage:gold_shulker_box',
    'sophisticatedstorage:diamond_shulker_box',
    'sophisticatedstorage:netherite_shulker_box',
    'sophisticatedstorage:stack_upgrade_tier_1_plus',
    'sophisticatedstorage:stack_upgrade_tier_5',
    'sophisticatedstorage:stack_upgrade_omega_tier',
    'sophisticatedstorage:infinity_upgrade',
    'sophisticatedstorage:survival_infinity_upgrade',
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
  ].forEach(item => event.hide(item))
  ;[
    'sophisticatedstorage:controller',
    'sophisticatedstorage:storage_link',
    'sophisticatedstorage:storage_io',
    'sophisticatedstorage:storage_input',
    'sophisticatedstorage:storage_output'
  ].forEach(item => event.hide(item))
  event.hide(/sophisticatedstorage:.*storage_connector/)
})
