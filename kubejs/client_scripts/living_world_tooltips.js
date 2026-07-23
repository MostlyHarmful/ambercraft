ItemEvents.tooltip(event => {
  event.add(
    'kubejs:expedition_ledger',
    Text.gray('Right-click for shared campaign progress and a spoiler-light lead.')
  )
  event.add(
    'kubejs:weathered_eye_chart',
    Text.gray('Surround an Eye of Ender with paper, then set this chart beneath it.')
  )
  event.add(
    'kubejs:rimebound_eye_shard',
    Text.gray('Combine with an Eye of Ender, blue ice, packed ice, and snow.')
  )
  event.add(
    'alexscaves:pure_darkness',
    Text.darkGray('Obsidian, an Echo Shard, and an Eye of Ender may focus this darkness.')
  )

  const routeHints = {
    'endrem:old_eye': 'A weathered chart from an inhabited settlement can restore it.',
    'endrem:rogue_eye': 'The deepest chamber of a jungle temple remembers this eye.',
    'endrem:nether_eye': 'Seek a place of worship within a great Nether fortress.',
    'endrem:cold_eye': 'A legendary creature sleeps beneath the snow.',
    'endrem:magical_eye': 'A solar sovereign guards this power.',
    'endrem:black_eye': 'Pure darkness gathers in a rare hollow beneath the world.',
    'endrem:lost_eye': 'Ancient mines still contain the work of forgotten engineers.',
    'endrem:wither_eye': 'A great shared victory over the Wither awakens it.',
    'endrem:guardian_eye': 'Face an elder guardian with an ally close at hand.',
    'endrem:cursed_eye': 'A king without a kingdom watches over a forbidden Nether castle.',
    'endrem:exotic_eye': 'Ocean monuments and conduits point toward its origin.',
    'endrem:evil_eye': 'A treasure borne above the clouds carries this old protection.',
    'endrem:undead_eye': 'A necromancer guards the soul needed to restore it.',
    'endrem:undead_soul': 'Restore it with an Eye of Ender, bones, a ghast tear, and phantom membrane.',
    'endrem:cryptic_eye': 'Ancient cities conceal its pattern.',
    'endrem:corrupted_eye': 'Search the records of a fortified pillager stronghold.',
    'endrem:witch_eye': 'Witches and their oldest huts preserve its pupil.'
  }

  Object.entries(routeHints).forEach(([item, hint]) => {
    event.add(item, Text.darkGray(hint))
  })
})
