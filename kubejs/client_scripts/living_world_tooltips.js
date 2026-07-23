ItemEvents.tooltip(event => {
  event.add(
    'kubejs:expedition_ledger',
    Text.gray('Right-click to see what the group has found and where to look next.')
  )
  event.add(
    'kubejs:weathered_eye_chart',
    Text.gray('The old marks line up around an Eye of Ender. Paper may restore the missing edges.')
  )
  event.add(
    'kubejs:rimebound_eye_shard',
    Text.gray('Cold enough to frost an Eye of Ender. Blue ice and snow might hold it together.')
  )
  event.add(
    'alexscaves:pure_darkness',
    Text.darkGray('Obsidian, an Echo Shard, and an Eye of Ender may focus this darkness.')
  )

  const routeHints = {
    'endrem:old_eye': 'A weathered chart from an inhabited settlement can restore it.',
    'endrem:rogue_eye': 'The deepest chamber of a jungle temple remembers this eye.',
    'endrem:nether_eye': 'Seek a place of worship within a great Nether fortress.',
    'endrem:cold_eye': 'Something enormous sleeps beneath the snow.',
    'endrem:magical_eye': 'A sunbird king keeps this power close.',
    'endrem:black_eye': 'Pure darkness gathers in a rare hollow beneath the world.',
    'endrem:lost_eye': 'Ancient mines still contain the work of forgotten engineers.',
    'endrem:wither_eye': 'The Wither must fall with more than one hunter in the fight.',
    'endrem:guardian_eye': 'An elder guardian will not give this up to a lone hunter.',
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
