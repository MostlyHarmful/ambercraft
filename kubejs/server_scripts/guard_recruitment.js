// Large settlements should be able to raise a modest defense without a player
// managing every recruit. Mob Conversion's 1.20.1 area cap proved unreliable,
// so Ambercraft handles this conservatively and transparently.

const GUARD_RECRUITMENT_INTERVAL = 1200
const GUARD_RECRUITMENT_RADIUS = 96
const GUARD_RECRUITMENT_OBJECTIVES = [
  'amber_villagers',
  'amber_guards'
]

let guardRecruitmentTicks = 0
let guardRecruitmentObjectivesReady = false

function initializeGuardRecruitment(server) {
  if (guardRecruitmentObjectivesReady) return

  GUARD_RECRUITMENT_OBJECTIVES.forEach(objective => {
    server.runCommandSilent(`scoreboard objectives add ${objective} dummy`)
  })
  guardRecruitmentObjectivesReady = true
}

function recruitGuard(server, playerName, conditions) {
  const common =
    `execute as ${playerName} at @s ${conditions} ` +
    `if entity @e[type=guardvillagers:guard,distance=..${GUARD_RECRUITMENT_RADIUS}] `

  let selected = server.runCommandSilent(
    common +
    `as @e[type=minecraft:villager,distance=..${GUARD_RECRUITMENT_RADIUS},sort=random,limit=1,` +
    'nbt={Age:0,VillagerData:{profession:"minecraft:none"}}] ' +
    'run tag @s add ambercraft_guard_recruit'
  )

  if (selected <= 0) {
    selected = server.runCommandSilent(
      common +
      `as @e[type=minecraft:villager,distance=..${GUARD_RECRUITMENT_RADIUS},sort=random,limit=1,` +
      'nbt={Age:0,VillagerData:{profession:"minecraft:nitwit"}}] ' +
      'run tag @s add ambercraft_guard_recruit'
    )
  }

  if (selected <= 0) return false

  const summoned = server.runCommandSilent(
    'execute as @e[type=minecraft:villager,tag=ambercraft_guard_recruit] at @s ' +
    'run summon guardvillagers:guard ~ ~ ~ ' +
    '{PersistenceRequired:1b,Patrolling:1b,Tags:["ambercraft_auto_recruited_guard","ambercraft_new_recruit"]}'
  )

  if (summoned <= 0) {
    server.runCommandSilent(
      'tag @e[type=minecraft:villager,tag=ambercraft_guard_recruit] remove ambercraft_guard_recruit'
    )
    return false
  }

  server.runCommandSilent(
    'loot replace entity @e[type=guardvillagers:guard,tag=ambercraft_new_recruit] ' +
    'weapon.mainhand 1 loot ambercraft:entities/guard_weapon'
  )
  server.runCommandSilent(
    'item replace entity @e[type=guardvillagers:guard,tag=ambercraft_new_recruit] ' +
    'weapon.offhand with minecraft:air'
  )
  server.runCommandSilent(
    'item replace entity @e[type=guardvillagers:guard,tag=ambercraft_new_recruit,' +
    'nbt={HandItems:[{id:"minecraft:iron_sword"}]}] weapon.offhand with minecraft:shield'
  )
  server.runCommandSilent(
    'item replace entity @e[type=guardvillagers:guard,tag=ambercraft_new_recruit,' +
    'nbt={HandItems:[{id:"minecraft:iron_axe"}]}] weapon.offhand with minecraft:shield'
  )
  server.runCommandSilent(
    'tag @e[type=guardvillagers:guard,tag=ambercraft_new_recruit] remove ambercraft_new_recruit'
  )
  server.runCommandSilent(
    'kill @e[type=minecraft:villager,tag=ambercraft_guard_recruit]'
  )

  return true
}

ServerEvents.tick(event => {
  guardRecruitmentTicks++
  if (guardRecruitmentTicks < GUARD_RECRUITMENT_INTERVAL) return
  guardRecruitmentTicks = 0

  initializeGuardRecruitment(event.server)

  event.server.players.forEach(player => {
    if (player.isSpectator() || !player.isAlive()) return

    const playerName = player.name.string

    event.server.runCommandSilent(
      `execute as ${playerName} at @s store result score ${playerName} amber_villagers ` +
      `run execute if entity @e[type=minecraft:villager,distance=..${GUARD_RECRUITMENT_RADIUS}]`
    )
    event.server.runCommandSilent(
      `execute as ${playerName} at @s store result score ${playerName} amber_guards ` +
      `run execute if entity @e[type=guardvillagers:guard,distance=..${GUARD_RECRUITMENT_RADIUS}]`
    )

    // A settled village maintains roughly one guard for every four to five
    // villagers. Only otherwise-unemployed adults are eligible.
    recruitGuard(
      event.server,
      playerName,
      `if score ${playerName} amber_villagers matches 10..19 ` +
      `if score ${playerName} amber_guards matches ..3`
    )
    recruitGuard(
      event.server,
      playerName,
      `if score ${playerName} amber_villagers matches 20..34 ` +
      `if score ${playerName} amber_guards matches ..5`
    )
    recruitGuard(
      event.server,
      playerName,
      `if score ${playerName} amber_villagers matches 35.. ` +
      `if score ${playerName} amber_guards matches ..7`
    )

    // Recount after ordinary recruitment. An active local threat permits one
    // additional emergency recruit per cycle, up to two above the normal cap.
    event.server.runCommandSilent(
      `execute as ${playerName} at @s store result score ${playerName} amber_guards ` +
      `run execute if entity @e[type=guardvillagers:guard,distance=..${GUARD_RECRUITMENT_RADIUS}]`
    )
    const threat =
      `if entity @e[type=#ambercraft:village_threats,distance=..${GUARD_RECRUITMENT_RADIUS}] `

    recruitGuard(
      event.server,
      playerName,
      threat +
      `if score ${playerName} amber_villagers matches 10..19 ` +
      `if score ${playerName} amber_guards matches ..5`
    )
    recruitGuard(
      event.server,
      playerName,
      threat +
      `if score ${playerName} amber_villagers matches 20..34 ` +
      `if score ${playerName} amber_guards matches ..7`
    )
    recruitGuard(
      event.server,
      playerName,
      threat +
      `if score ${playerName} amber_villagers matches 35.. ` +
      `if score ${playerName} amber_guards matches ..9`
    )
  })
})
