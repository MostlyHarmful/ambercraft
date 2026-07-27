// Older Ambercraft releases replaced Integrated Villages' optional guards with
// iron golems. Minecraft discarded their Guard Villagers-only fields after the
// first save, but retained PersistenceRequired from every authored template.
// Natural and player-built golems do not set that flag.
//
// Keep this migration active so legacy golems in unloaded chunks are converted
// when their village is visited. Newly generated villages now contain real
// guards and never enter this path.

const LEGACY_GUARD_GOLEM =
  '@e[type=minecraft:iron_golem,nbt={PersistenceRequired:1b},tag=!ambercraft_guard_source_processed]'

let legacyGuardMigrationTicks = 0

ServerEvents.tick(event => {
  legacyGuardMigrationTicks++
  if (legacyGuardMigrationTicks < 200) return
  legacyGuardMigrationTicks = 0

  // Every guard carrying this tag came from the faulty looping migration.
  // Correct replacements use ambercraft_restored_guard and are unaffected.
  event.server.runCommandSilent(
    'kill @e[type=guardvillagers:guard,tag=ambercraft_migrated_guard]'
  )

  // Create now ignores guards when automatically seating nearby entities.
  // Dismount each pre-existing guard once so guards already saved in a seat are
  // released when their chunk is next loaded.
  event.server.runCommandSilent(
    'execute as @e[type=guardvillagers:guard,tag=!ambercraft_seat_compat_checked] run ride @s dismount'
  )
  event.server.runCommandSilent(
    'tag @e[type=guardvillagers:guard,tag=!ambercraft_seat_compat_checked] add ambercraft_seat_compat_checked'
  )

  const sources = event.server.runCommandSilent(
    `tag ${LEGACY_GUARD_GOLEM} add ambercraft_guard_source_pending`
  )
  if (sources <= 0) return

  event.server.runCommandSilent(
    'tag @e[type=minecraft:iron_golem,tag=ambercraft_guard_source_pending] add ambercraft_guard_source_processed'
  )

  const converted = event.server.runCommandSilent(
    'execute as @e[type=minecraft:iron_golem,tag=ambercraft_guard_source_pending] at @s ' +
    'if entity @s[y=-64,dy=448] run summon guardvillagers:guard ~ ~ ~ ' +
    '{PersistenceRequired:1b,Patrolling:1b,Tags:["ambercraft_restored_guard","ambercraft_new_guard"]}'
  )

  if (converted > 0) {
    event.server.runCommandSilent(
      'item replace entity @e[type=guardvillagers:guard,tag=ambercraft_new_guard] weapon.mainhand with minecraft:iron_sword'
    )
    event.server.runCommandSilent(
      'item replace entity @e[type=guardvillagers:guard,tag=ambercraft_new_guard] weapon.offhand with minecraft:shield'
    )
    event.server.runCommandSilent(
      'tag @e[type=guardvillagers:guard,tag=ambercraft_new_guard] remove ambercraft_new_guard'
    )

    console.info(
      `[Ambercraft] Restored ${converted} legacy Integrated Villages guard${converted === 1 ? '' : 's'}.`
    )
  }

  event.server.runCommandSilent(
    'kill @e[type=minecraft:iron_golem,tag=ambercraft_guard_source_pending]'
  )
  console.info(
    `[Ambercraft] Marked ${sources} legacy guard source${sources === 1 ? '' : 's'} as processed.`
  )
  event.server.runCommandSilent(
    'tag @e[type=minecraft:iron_golem,tag=ambercraft_guard_source_pending] remove ambercraft_guard_source_pending'
  )
})
