const GameExtender = {
    broadcastInterval:0,
    timers: new Set(),
    intervals: [],
    print: function (item) {
        this.modding.terminal.echo(item);
    },
    echo: function (item) {
        this.print(item);
    },
    log: function (item) {
        this.print(item);
    },
    error: function (item) {
        this.modding.terminal.error(item);
    },
    kick: function (identifier) {
        let ship = this.findShip(identifier);
        return ship && ship.gameover({
            "Status": "Kicked by operator",
            "Score": ship.score,
            "High score": ship.highscore,
            "Frags": ship.frag,
            "Deaths": ship.death
        });
    },
    kill: function (identifier) {
        let ship = this.findShip(identifier);
        return ship && ship.set({
            kill: true
        });
    },
    locateShip: function (identifier) {
        if (typeof identifier == "number") {
            return this.findShip(identifier);
        }
        let searchQuery = identifier.toLowerCase();
        for (let shipIndex in this.ships) {
            let ship = this.ships[shipIndex];
            let shipName = ship.name.toLowerCase();
            if (shipName.includes(searchQuery)) {
                return ship;
            }
        }
        return null;
    },
    setTimeout: function (func, ticks) {
        let currentTick = this.step;
        this.timers.add([func, currentTick + ticks, this]);
    },
    setInterval: function (func, ticks) {
        let currentTick = this.step;
        return this.intervals.push([func, ticks]) - 1;
    },
    clearInterval: function (index) {
        this.intervals.splice(index, 1);
    },
    checkForTimers: function () {
        this.timers.forEach(function (timer) {
            let game = timer[2];
            if (game.step >= timer[1]) {
                timer[0]();
                game.timers.delete(timer);
            }
        });
    },
    checkForIntervals: function () {
        this.intervals.forEach(function (interval) {
            if (game.step % interval[1] === 0) {
                interval[0]();
            }
        });
    },
    updateShips: function (event) {
        if (!event)
            this.ships.forEach(function (ship) {
                ship.highscore = Math.max(ship.highscore || 0, ship.score);
                if (Object.is(ship.death)) ship.death = 0;
                if (Object.is(ship.frag)) ship.frag = 0;
            });
        else
            switch (event.name || "") {
                case "ship_destroyed":
                    if (!Object.is(event.killer, null)) event.killer.frag++;
                    if (!Object.is(event.ship, null)) event.ship.death++;
                    break;
            }
    },
    instructorBroadcast: function(message, _instructor, _delay) {
        _instructor = _instructor || "Lucina";
        _delay = Number(_delay) || 120;
        this.setTimeout(function() {
          this.ships.forEach(function(ship) {
            ship.instructorSays(message, _instructor);
          });
        }.bind(this), this.broadcastInterval);
        this.broadcastInterval = this.broadcastInterval + _delay;
        this.setTimeout(function() {
            (this.broadcastInterval == _delay) && this.ships.forEach(function(ship) {
                ship.hideInstructor();
            });
            this.broadcastInterval = this.broadcastInterval - _delay;
        }.bind(this), this.broadcastInterval);
    },
    emptyWeapons: function () {
      this.ships.forEach(function(ship) {
        ship.emptyWeapons();
      });
    }
};

const ShipExtender = {
  kill: function () {
    this.set({
      kill: true
    });
    return this;
  }  
};

for (let prop of ["invulnerable","angle"])
  eval(`ShipExtender.${prop} = function(data) {
    this.set({
      ${prop}: data
    });
    return this;
  }`);
  
const AlienExtender = {
  kill: function () {
    return this.set({
      kill: true
    });
  },
  laserSpeed: function (data) {
    return this.laser_speed(data);
  }
};

for (let prop of ["shield","regen","damage","laser_speed","rate"])
  eval(`AlienExtender.${prop} = function(data) {
    this.set({
      ${prop}: data
    });
    return this;
  }`);
  
Object.assign(game, GameExtender);
Object.assign(I1l00.prototype, ShipExtender);
Object.assign(Alien.prototype, AlienExtender);

game.modding.tick = function(t) {
    var e;
    if (this.game.tick(t), e = Date.now(),this.game.updateShips(), this.game.checkForTimers(), this.game.checkForIntervals(), null != this.context.tick && this.context.tick(this.game), e = Date.now() - e, this.max_tick_time = Math.max(this.max_tick_time, e), this.tick_time += e, this.tick_count += 1, this.tick_count >= 600) return this.terminal.echo("Tick CPU time: average " + Math.round(this.tick_time / this.tick_count) + " ms ; max " + Math.round(this.max_tick_time) + " ms"), this.terminal.echo("Data sent: " + Math.round(this.I1I0I.log_sent / this.tick_count * 60) + " bytes per second"), this.tick_count = 0, this.tick_time = 0, this.max_tick_time = 0, this.I1I0I.log_sent = 0
}
game.modding.I1I0I.eventReceived = function(t) {
    var e, i, s, n, r;
    if (null != t.data) {
        null != t.data.ship && (r = this.modding.game.findShip(t.data.ship), t.data.ship = r), null != t.data.killer && (n = this.modding.game.findShip(t.data.killer), t.data.killer = n), null != t.data.alien && (e = this.modding.game.findAlien(t.data.alien), t.data.alien = e), null != t.data.asteroid && (i = this.modding.game.findAsteroid(t.data.asteroid), t.data.asteroid = i), null != t.data.collectible && (s = this.modding.game.findCollectible(t.data.collectible), t.data.collectible = s);
        try {
            null != this.modding.context.event && (this.modding.game.updateShips(t.data), this.modding.context.event(t.data, this.modding.game))
        } catch (t) {
            t
        }
        switch (t.data.name) {
            case "asteroid_destroyed":
                if (null != i) return i.killed = !0;
                break;
            case "alien_destroyed":
                if (null != e) return e.killed = !0;
                break;
            case "collectible_picked":
                if (null != s) return s.killed = !0
        }
    }
}
