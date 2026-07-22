// Chipped exposes its decorative variants through six dedicated workstations.
// Listing every variant separately adds almost seven thousand JEI ingredients,
// so keep the entry points visible and let the workstations serve as the catalog.
JEIEvents.hideItems(event => {
  event.hide(
    /chipped:(?!(alchemy_bench|botanist_workbench|carpenters_table|loom_table|mason_table|tinkering_table)$).+/
  )

  // Every Compat generates Chipped variants for compatible wood families under
  // this path. They use the same Chipped workstations, so listing them here is
  // redundant while other Every Compat families should remain searchable.
  event.hide(/everycomp:chipped\/.+/)
})
