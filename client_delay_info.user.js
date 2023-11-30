// ==UserScript==
// @name         Client Delay Info
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Show delay for some info
// @author       Bhpsngum
// @include      /^https\:\/\/starblast\.io\/(app.html(\?.+)*)*$/
// @icon         https://starblast.io/static/img/icon64.png
// @downloadURL  https://github.com/Bhpsngum/bin/raw/master/client_delay_info.user.js
// @updateURL    https://github.com/Bhpsngum/bin/raw/master/client_delay_info.user.js
// @grant        none
// ==/UserScript==

(function () {
	'use strict';
	const elementHTML = `<table>
		<tbody>
			<tr title="Client rendering FPS">
				<td class="bold">FPS</td>
				<td> : </td>
				<td class="bold right" id="info-fps">N/A</td>
			</tr>
			<tr title="Client rendering delay. This is relative to your client FPS">
				<td class="bold">Rendering</td>
				<td> : </td>
				<td class="bold right" id="info-rendering">N/A</td>
				<td> ms</td>
			</tr>
			<tr title="Mouse input delay">
				<td class="bold">Mouse</td>
				<td> : </td>
				<td class="bold right" id="info-mouse">N/A</td>
				<td> ms</td>
			</tr>
			<tr title="Touch input delay">
				<td class="bold">Touch</td>
				<td> : </td>
				<td class="bold right" id="info-touch">N/A</td>
				<td> ms</td>
			</tr>
			<tr title="Keyboard input delay">
				<td class="bold">Keyboard</td>
				<td> : </td>
				<td class="bold right" id="info-keyboard">N/A</td>
				<td> ms</td>
			</tr>
			<tr title="Client control event delay from when browser registered the input to when it actually sent\nControl Events are:\n- RCS toggle\n- Start/Stop shooting\n- Start/Stop movement\n- Start/Stop strafing\nA complete delay from when you press mouse/keyboard button to when it actually sents can be computed as:\n(Mouse/Touch/Keyboard depending on which you started the action) delay + Control Event delay">
				<td class="bold">Control Event</td>
				<td> : </td>
				<td class="bold right" id="info-control">N/A</td>
				<td> ms</td>
			</tr>
			<tr title="Client rotation input delay. This is calculated as:\ndelay = client mousemove input delay + delay until sent to server">
				<td class="bold">Rotation</td>
				<td> : </td>
				<td class="bold right" id="info-rotation_client">N/A</td>
				<td> ms </td>
				<td> + </td>
				<td class="bold right" id="info-rotation">N/A</td>
				<td> ms</td>
			</tr>
			<tr title="Delay between each registered movement.\nThis value may have the lower bound depending on your browser's refresh rate.">
				<td class="bold">Mouse/Touch Movement</td>
				<td> : </td>
				<td class="bold right" id="info-rotation_global">N/A</td>
				<td> ms </td>
			</tr>
			<tr title="Network ping">
				<td class="bold" id="info-region">Ping</td>
				<td> : </td>
				<td class="bold right" id="info-ping">N/A</td>
				<td> ms</td>
			</tr>
		</tbody>
	</table>`;

	let container = document.createElement("div");
	container.innerHTML = elementHTML;
	container.id = "delay-info";
	document.body.appendChild(container);

	let style = document.createElement("style");
	style.innerHTML = `#delay-info {
		position: fixed;
		bottom: 1%;
		right: 1%;
		z-index: 10000;
		background-color: #fff;
	}

	#delay-info > table > tbody > tr:not(:first-child, :last-child) {
		display: var(--delay-info-display);
	}

	#delay-info > table tr {
		cursor: help;
	}
	
	#delay-info .bold {
		font-weight: bold;
	}
	
	#delay-info .right {
		text-align: right;
	}`;

	document.head.appendChild(style);

	const main = Object.values(window.module.exports.settings).find(v => v && v.mode), data = {
		update: function (field) {
			let text = this[field] == null ? "N/A" : this[field];
			if (field != "region") text = (text == null || isNaN(text)) ? "N/A" : Math.round(text);
			let con = container.querySelector("#info-" + field);
			if (con.innerText != text) con.innerText = text;
		}
	};

	for (let i of ["fps", "control", "rendering", "rotation", "ping", "region", "rotation_global", "keyboard", "mouse", "touch", "rotation_client"]) {
		Object.defineProperty(data, i, {
			get () { return this[`__${i}__`] },
			set (val) {
				let old = this[`__${i}__`];
				this[`__${i}__`] = val;
				if (val != old) this.update(i);
			}
		})
	}

	let lastInfo = {};
	
	setInterval(function () {
		let ping = (Object.values(main).find(v => v && v.socket) || {}).ping_value;
		if (ping != null) data.ping = ping;
		if (main.region != null) data.region = `Ping (${main.region})`;
	}, 1);

	let fpsTime = null;
	let checkFPS = function (perf) {
		if (fpsTime != null) {
			data.rendering = perf - fpsTime;
			data.fps = 1000 / data.rendering;
		}
		fpsTime = perf;
		window.requestAnimationFrame(checkFPS);
	}

	window.requestAnimationFrame(checkFPS);

	let send = WebSocket.prototype.send;
	WebSocket.prototype.send = function(e) {
		if (!isNaN(e)) {
			let control = Math.trunc(e / 4096), now = performance.now();
			if (control > 0 && lastInfo.control != null) {
				data.control = now - lastInfo.control;
				lastInfo.control = null;
			}

			if (lastInfo.angle != (e % 4096)) {
				if (lastInfo.firstMessageSent) {
					if (lastInfo.rotation != null) {
						data.rotation = now - lastInfo.rotation;
						lastInfo.rotation = null;
					}
					lastInfo.angle = e % 4096;
				}
				lastInfo.firstMessageSent = true;
			}
		}
		send.call(this, e);
	}

	let shooter, key;
	
	for (let i in window) try {
		let val = window[i];
		if ("function" == typeof val.prototype.isPulseType) {
			shooter = val;
			key = i;
			break;
		}
	} catch (e) {}

	let objKey = shooter.toString().match(/this\.([1lI0O]{5})\s*\=\s*\{[^]+?\}/)[1];
    window[key] = class extends shooter {
        constructor(...args) {
            super(...args);
            let value = this[objKey], self = this;
            for (let k in value) {
                if ("angle" != k && "boolean" != typeof value[k]) continue;
                let rep = `__${k}__`;
                value[rep] = value[k];
                Object.defineProperty(value, k, {
                    get () { return this[rep] },
                    set (val) {
                        let oldVal = this[rep];
                        this[rep] = val;
                        if (val != oldVal) {
							let now = performance.now();
							if (k != "angle") lastInfo.control = now;
							else if (lastInfo.firstMessageSent && lastInfo.rotation == null) {
								lastInfo.rotation = now;
							}
                        }
                    }
                })
            }
        }
    }

	let holding = false, hover = false, toggleInfo = function(show) {
		document.documentElement.style.setProperty("--delay-info-display", show ? "table-row" : "none");
	};

	let lastHidden = localStorage.getItem("delay_counter_hidden") == "true";
	let setContainer = function (status) {
		lastHidden = !!status;
		localStorage.setItem("delay_counter_hidden", lastHidden);
		container.style.display = lastHidden ? "none" : "";
	}

	let measureTime = function (timestamp) {
		let dateNow = Date.now();
		if (!('performance' in window)) return dateNow - timestamp;

		let perfNow = performance.now();

		if (timestamp >= perfNow) return dateNow - timestamp;
		
		return perfNow - timestamp;
	}

	document.addEventListener("keydown", function (e) {
		if (e.key == "Shift") {
			holding = !holding;
			if (holding) toggleInfo(true);
			else if (!hover) toggleInfo(false);
		}

		if (e.keyCode == 191 /* / */) setContainer(!lastHidden);

		if (e.timeStamp) data.keyboard = measureTime(e.timeStamp);
	});

	for (let i of ["mousedown", "mouseup", "touchstart", "touchend"]) document.addEventListener(i, function (e) {
		if (e.timeStamp) data[i.slice(0, 5)] = measureTime(e.timeStamp);
	});

	container.addEventListener("mouseover", function (e) {
		hover = true;
		toggleInfo(true);
	});

	container.addEventListener("mouseout", function (e) {
		hover = false;
		if (!holding) toggleInfo(false);
	});

	for (let i of ["mousemove", "touchmove"]) document.addEventListener(i, function (e) {
		let now = performance.now();
		if (lastInfo.rotation_global != now && lastInfo.rotation_global != null) data.rotation_global = now - lastInfo.rotation_global; 
		lastInfo.rotation_global = now;

		if (e.timeStamp) data.rotation_client = measureTime(e.timeStamp);
	});

	toggleInfo(false);
	setContainer(lastHidden);
})();