This file covers what has changed after the 4.1 version only

Any changes before the 4.1 version are not recorded.

# 4.1.0
## Mar 6, 2024

### Builds
- pre-release

### Ships

**Legend:**
- (X) Ship model change/bug fix
- (+) Ship buff
- (–) Ship nerf
- (*) Ship addtion/removal

#### Advanced-Fighter
- (X) Affected ships now have E-cap set to 0

#### Aetos
- (*) Added from 4.1
- (*) Ability "Shape Switch"
	- Switches between 5 forms (Assault, Bomber, Defence, Interceptor and Spear) randomly
	- Ability duration 15s
	- Ability CD 25s
- (*) New base model added
- (*) New ability models added

#### Anomaly
- (X) Bug where remaining ability time not shown fixed
- (–) Base laser damage 15 x 5 > 10 x 5
- (–) Ability S-regen 10 > 7

#### Arcane
- (+) Ability duration 4s > 3s

#### Blunderbuss
- (+) Ability speed 75 > 85

#### Chimera
- (–) Removed energy regeneration after ability

#### Contraband
- (–) Ability CD 13s > 14s

#### Ghoul
- (*) Ship temporarily removed

#### Hellcat
- (X) New base model
	- Firing pattern changed
- (X) New ability model
- (X) Ability no longer spawns defence pods for collider-less ships (e.g Sigma ability, Ekho ability)
- (+) Base S-cap 350 > 370
- (+) Base S-regen 8 > 9
- (+) Base speed 90 > 95
- (+) Ability E-cap 200 > 300
- (+) Ability speed 108 > 118
- (+) Ability rotation 68 > 88
- (+) Ability acceleration 115 > 135
- (–) Base E-cap 250 > 240
- (–) Base E-regen 65 > 63
- (–) Ability mass 360 > 300

#### Lancelot
- (X) New ability model
- (+) Base zoom 1.0x > 0.85x
- (+) Ability zoom 1.0x > 0.85x

#### Megalodon
- (X) Ability anti-troll added
- (+) Base E-capacity 210 > 230
- (+) Ability kills 4 > 3
- (–) Base E-regen 53 > 50
- (–) Base mass 230 > 210
- (–) Ability S-capacity 600 > 555
- (–) Ability S-regen 20 > 15
- (–) Ability E-regen 90 > 75
- (–) Ability mass  525 > 420
- (–) Ability speed 120 > 100 
- (–) Ability rotation 38 > 30
- (–) Ability acceleration 155 > 115

#### Mosquit
- (*) Ship removed

#### Paradox
- (X) Ability anti-troll added

#### Phoenix
- (+) Ability rotation 5 > 10 

#### Piercer
- (–) Ability reload delay 0s > 1.25s

#### Puck
- (X) Bug where Puck restores shield & gems upon starting and ending ability fixed
- (X) Bug where Pucked Valkyrie has healing lasers fixed
- (+) Puck can now copy any ship regardless of ship limit

#### Reaper
- (X) Ability no longer spawns defence pods for collider-less ships (e.g Sigma ability, Ekho ability)

#### Rock-Tower
- (X) Ability rework
	- Ability replaced by Bastion
- (X) New ability model

#### Shadow X-2
- (X) Ability rework
	- Shadow X-2 -> Shadow X-3 -> Shadow X-1
- (X) New ability model Shadow X-1 added
- (X) New ability Shadow X-3 model 
- (+) Base E-regen 170 > 300
- (+) Base mass 125 > 145
- (+) Ability side laser dmg 8 > 10
- (+) Ability E-capacity 282 > 300
- (+) Ability E-regen 60 > 69
- (+) Ability speed 142 > 160
- (–) Base S-regen 10 > 5
- (–) Ability zoom 0.8x -> 0.98x
- (–) Ability S-capacity 455 > 444
- (–) Ability S-regen 13 > 12
- (–) Ability mass 420 > 390
- (–) Ability main laser speed 350 > 250

#### Sigma
- (X) New ability model added
- (–) Ability can now be affected by other non-damaging abilities 
- (–) Ability can now be hit by non-laser damage (e.g O-Defender torp)
- (–) Ability size 1.88 > 1.98

#### Thunder
- (X) Ability anti-troll added
- (X) New Preparing model 
	- Visually identical to ability model
- (+) Ability "Preparing" stage added
	- Immovable by teammates
- (–) Base mass 375 > 320
- (–) Base speed 150 > 135
- (–) Base rotation 85 > 80
- (–) Ability dash speed 5 > 4
- (X) Ability duration 3s > 1.6s

#### Toscain
- (*) Added from 4.1
- (*) Ability "Parasite"
	- Nearby enemies turned into Parasite
	- Ability max no. of affected ships 2
	- Ability duration 8s
	- Ability CD 48s
	- Ability radius 45
- (*) New base model added
- (*) New ability model Parasite added

#### Valence
- (–) Base S-capacity 270 > 240
- (–) Base S-regen 8.5 > 7
- (–) Base rotation 110 > 80
- (–) Base laser speed 220 > 135
- (–) Ability speed boost 1.5 > 0.8

#### Valkyrie
- (X) Valkyrie now cannot be healed by any healing fields

#### Viking
- (–) Offensive form laser speed 390 > 360
- (–) Defensive form E-regen 70 > 65

#### Vulcan
- (X) New Higher form model
- (X) New Lower form model
- (–) Higher form E-regen 100 > 90
- (–) Higher form laser rate 0.2 > 0.185

#### Warthog
- (X) New base model
- (X) New ability model
- (+) Ability rockets > missiles
- (–) Base S-capacity 250 > 235
- (–) Base S-regen 8 > 7
- (–) Ability secondaries fired 10 > 6
- (–) Ability CD 33s > 40s

#### Wasp
- (X) Ability anti-troll added
- (–) Ability health drain now also ends on Wasp’s death

#### Zeus
- (+) Base zoom 1x > 0.95x

### Maps
- Fix spawnpoints problem on Deathwings and Shockwave maps
- Fill asteroids on some maps to prevent wrong alien spawning
### Gameplay
- Score boosting mechanism adjusted to prevent massive point increase late-game
- Ship limit for MS and Main modes 3 --> 2
### Code and hosting
#### General
- All template names can now be referred using their aliases in related commands or methods, e.g O-Defender --> odef, Advanced-Fighter --> advf
#### Commands
- Add `banregex <regex>` command to ban players by RegExp.
- Add `hide <template>` and `unhide <template>` to hide/unhide ships from list of playable ships.
- All ban-related commands (`ban`, `banphrase` and `banregex`) now apply to any ship currently staying in the game if they match the banning condition.
- Add `time <time>` command to set/view timer value while mod is running.
- Add `elapsed` command to see how long the game has been running.
#### Gameplay code
- Add `GAME_OPTIONS.spectator_hue` to set spectator hue for Main, MS and Battlefield modes.
- Add `GAME_OPTIONS.stage_points` as a factor to control score boost.
- Add `BASES.spawning_invulnerability_distance_limit_ratio` to control spawning invulnerability after leaving base to a certain range.
#### Ability System functionalities
- New ship's custom properties added:
	- `ship.custom.anti_teleportation`: Marks that this ship should immune to teleporting
	- `ship.custom.nerf_teleporters`: Marks that any ship trying to teleport this ship should be nerfed 
	- `ship.custom.buff_teleporters`: Marks that any ship trying to teleport this ship should be buffed
- Ability template properties change:
	- Added `antiTeleportation`, `antiTeleportationInAbility`, `nerfTeleporters`, `nerfTeleportersInAbility`, `buffTeleporters`, and `buffTeleportersInAbility`.
	- Removed `actionBlocker`, `abilityBlocker` and `shipChangeBlocker`.
- Blocker rework, now you can manage blockers via `AbilityManager.blockers`:
	- To add blocker to ship use `AbilityManager.blockers.set(ship, blockerConfig, template)` (`template` is optional). This function returns blocker ID.
	- To remove blocker from ship use `AbilityManager.blockers.remove(ship, id, field, triggerClear)`. Set `id` to `null` to remove all blockers.
	- To check blocker status of one ship use `AbilityManager.blockers.check(ship, field)`. This is a replacement to old `AbilityManager.isAbilityBlocked(ship)` and `AbilityManager.isActionBlocked(ship)` functions.
- Add model overwrites manager to manage ship type overwrites, accessible via `AbilityManager.modelOverwrites`:
	- To add overwrite use `AbilityManager.modelOverwrites.set(ship, ship_type)`.
	- To remove overwrite use `AbilityManager.modelOverwrites.set(ship, ship_type)`. This function returns a boolean, indicating if the overwrite you just removed is the only overwrite of the ship.
