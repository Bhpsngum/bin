This file covers what has changed after the 4.1 version only

Any changes before the 4.1 version are not recorded.

# 4.1.0
## Build letoast
**Feb 12, 2024**

### Ships
In general, every ship models are changed and adjusted
#### Advanced-Fighter
- Ability CD 31s --> 45s
- Ability ship now has higher output damage during ability time
#### Scorpion
- Ability duration 20s --> 25s
- Odyssey will start with 500 energy regen and 800 HP
- After ability ends, the ship will be restored with the HP before it starts the ability
#### Condor
- Ability CD 45s --> 40s
- Ability duration 18s --> 20s
#### Marauder
- Ability CD 36s --> 40s
- Ability duration 2s --> 3.5s
- Marauder is now immovable during ability
- There's a 0.5s delay upon starting ability before the ship can fire lazers
#### A-Speedster
- Ability CD 10s --> 15s
- Dashing mass dependency 1 / 1.5 --> 1 / 2
#### Rock-Tower
- Ability CD 18s --> 25s
#### Barracuda
- Ability CD 20s --> 30s
- Ability range 40 --> 35
- Ability pull strength 2 --> 2.3
- Barracuda will reset the energy capacity when starting the ability
#### O-Defender
- Ability CD 55s --> 60s
- Torpedo center DMG 850 --> 800
#### Contraband
- Ability CD 13s --> 15s
#### Paradox
- Ability CD 23s --> 25s
- Ability duration 3s --> 3.25s
#### Warthog
- Ability CD 33s --> 50s
- Ability duration 5s --> 6s
- Weapon fired changed Rocket --> Missile
- Amount of secondaries max 10 --> 6
#### Ekho
- Ability CD 28s ---> 27s
#### Vampire
- Ability CD 32s --> 34s
- Ability duration 3s --> 3.5s
#### Hellcat
- Ability CD 30s --> 45s
- Ability duration 15s --> 20s
- Ability range 30 --> 35
- Hellcat Attack Pod has better mass and firerate
#### Intervention
- Ability CD 34s --> 38s
#### Vulcan
- Lower + Higher CD 15s --> 20s
#### Phoenix
- Ability CD 36s --> 42s
- Ability duration 5s --> 6s
- Ship's velocity will be set to zero upon ability cast
#### Kunai
- Ability CD 9s --> 13s
- Ability range 60 --> 55
#### Lancelot
- Ability CD 32s --> 38s
#### BFG
- Ability CD 35s --> 38s
- Ability pre-aim duration 1.5s --> 1s
#### Puck
- Ability CD 37s --> 45s
- Pucked duration for victims 12.5s --> 15s
- Puck control duration for puck 25s --> 15s
#### Sigma
- Ability CD 35s --> 45s
- Ability duration 8s --> 10s
- Ability ship firerate decreased
#### Anomaly
- Ability CD 10s --> 12s
#### Guren
- Ability CD 33s --> 42s
#### Wasp
- Ability CD 33s --> 35s
- Ability penalty CD 1s --> 3s
#### Arcan
- Ability CD 36s --> 45s
- Ability duration 4s --> 3s
- Ability speed limit 3.25 --> 1
#### Erebos
- Ability CD 65s --> 60s
- Ability duration 6.5s --> 5s
#### Viking
- Defensive / Offensive ability CD 15s --> 20s
- Offensive ship firerate decreased
#### Thunder
- Ability CD 35s --> 42s
#### Ghoul
- Ability CD 40s --> 48s
- Ability CD now starts counting after the ability has ended
- Alien spread angle 0.1 --> 0.5
- Ship knockback speed upon ability cast 1.5 --> 1
- Invulnerability after ability cast 2s --> 1s
- Aliens lifespan 5s --> 6s
- Aliens count 10 --> 12
- Aliens DMG per level 25 --> 20
- Aliens repelling speed 1 --> 1.2
#### Blunderbuss
- Ability CD 27s --> 28s
#### Viper
- Ability CD 27s --> 33s
- Ability duration is now 1s
- Ability range 45 --> 50
- Push strength 1.69 --> 1.9
- Ship model changed on ability, allowing ship combo
#### Valkyrie
- Ability CD 25s --> 32s
#### Mosquit
- Ability CD 35s --> 40s
- Ability duration 10s --> 12s
- Add 150HP to ship upon ability cast
#### Zeus
- Ability CD 28s --> 35s
- Launch strength 3.845 --> 3.5
- Invulnerability after ability cast 200/60s --> 1.5s
#### Megalodon
- Kills required 4 --> 3
#### Shadow X-2
- Ability Rework to 2-stage ability:
	+ Starts with Shadow X-3 for 20s
	+ Turns to Shadow X-1 for 20s
#### Chimera
- Ability CD 30s --> 33s
- Ability duration 4s --> 5.6s
#### Valence
- Ability CD 25s --> 37s
- Incident zone damage delay 3s --> 2s
### Maps
- Fixed spawnpoints problem on Deathwings and Shockwave maps
- Fill asteroids on some maps to prevent wrong alien spawning
### Gameplay
- Score boosting mechanism adjusted to prevent massive point increase late-game
### Code and hosting
- Add `banregex <regex>` command to ban players by RegExp
- Add `GAME_OPTIONS.spectator_hue` to set spectator hue for Main, MS and Battlefield version
