// ==UserScript==
// @name         SL+ v2 and SL V Combined
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Combining both SL+ v2 and SL V API to spectate both team and survival games
// @author       Bhpsngum
// @match        https://starblast.dankdmitron.dev/
// @icon         https://starblast.dankdmitron.dev/img/dankdmitron.png
// @downloadURL  https://github.com/Bhpsngum/bin/raw/master/SLv2andSLV.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let script = document.createElement("script");
    script.innerHTML = "window.Spectator = Spectator;window.SystemReportManager = SystemReportManager";
    document.body.appendChild(script);

	const convert = function (obj, prop, replacer) {
		return window[obj].prototype[prop] = Function("return (" + replacer(window[obj].prototype[prop].toString().replace(/^(async)*/, "$& function ")) + ")")();
	}

	convert("SystemReportManager", "showInfo", function (old) {
		return old.replace('system.mode !== "invasion"', "true").replace(/}$/,`document.getElementById("systemSpectateButton").style.display = ""}`);
	});

	convert("Spectator", "bindWebSocket", function (old) {
		return old.replace(`self.destroyed = true;`, "").replace(`else if (json.name === "player_name")`, `else if (json.name === "no_system") {
			self.socket.close();
			let systemDataInfo = systemId.match(/\\d+/);
			if (systemDataInfo == null) self.destroyed = true;
			else self.bindAPI(systemDataInfo[0])
		} $&`);
	});

	convert("Spectator", "renderLeaderBoard", function (old) {
		return old.replace(`ship.profile.hue === team.hue`, `$& || self.useAlternativeAPI`).replace(`column.insertAdjacentHTML(`, `if (!self.useAlternativeAPI) $&`)
		.replace(/let title[^]+?column\.appendChild\(hr\);/, `if (!self.useAlternativeAPI) {$&}`).replace(`else if (firstShip.name === "U-Sniper Mk 2")`, `else if (firstShip == null) displayShips = true; $&`);
	});

	convert("Spectator", "renderMap", function (old) {
		return old.replace(`for (let team of self.modeInfo.mode.teams)`, `if (!self.useAlternativeAPI) $&`);
	});

	window.Spectator.prototype.continueAPILoop = function (systemId) {
		const self = this;
		if (self.destroyed) return;
		window.setTimeout(self.APILoop.bind(self), 1000, systemId);
	}

	window.Spectator.prototype.APILoop = function(systemId){
		const self = this;
		if (self.destroyed) return;

		fetch("https://api.pixelmelt.dev/status/" + systemId).then(async (response) => {
			try {
				response = await response.json();
				if (response.error || !response.api.live) return self.destroyed = true;
			}
			catch (e) {
				return self.continueAPILoop(systemId);
			}

			if (!self.systemInfoAcknowledged) {
				response.mode.teams = self.teams = [{}];
				self.handleModeInfo(response);
				self.systemInfoAcknowledged = true;
			}

			let receivedIDs = new Set();
            // if message is ship info
            let positionData = {
                timestamp: Date.now(),
                positions: []
            };

			for (let id in response.players) {
				let player = response.players[id];
				player.ship = player.type == null ? 101 : player.type;
				player.profile = player;
				player.alive = true;
                positionData.positions[id] = {...player};
                self.players[id] = player;
                // add the ID to the set of IDs we've received in this packet
                receivedIDs.add(id);
			}

			// Check if any of our currently stored player objects is not present in the radar
            // packet received. If it isn't present, delete it.
            for (let player of self.players) if (player && !receivedIDs.has(String(player.id))) delete self.players[player.id];
            // Push our position data to the end of the logs
            self.positionLogs.push(positionData);
            // if we don't have a current position yet, set the most recent info as the current position
            if (!self.activePosition) {
                self.activePosition = positionData;
                self.lastTickTimeStamp = Date.now();
            }

			self.continueAPILoop(systemId);
		}).catch(e => self.continueAPILoop(systemId));
	};

    window.Spectator.prototype.bindAPI = function (systemId) {
        const self = this;
		self.useAlternativeAPI = true;
        self.APILoop(systemId);
    };
})();