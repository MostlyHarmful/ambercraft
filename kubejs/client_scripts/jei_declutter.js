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
})
