StartupEvents.registry('item', event => {
  event.create('weathered_eye_chart')
    .displayName('Weathered Eye Chart')
    .rarity('uncommon')
    .texture('minecraft:item/map')

  event.create('rimebound_eye_shard')
    .displayName('Rimebound Eye Shard')
    .rarity('rare')
    .glow(true)
    .texture('minecraft:item/echo_shard')
})
