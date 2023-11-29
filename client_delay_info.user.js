// ==UserScript==
// @name         Client Delay Info
// @namespace    http://tampermonkey.net/
// @version      1.1
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
				<td> &nbsp; </td>
				<td class="bold right" id="info-fps">N/A</td>
			</tr>
			<tr title="Client rendering delay. This is relative to your client FPS">
				<td class="bold">Rendering</td>
				<td> &nbsp; </td>
				<td class="bold right" id="info-rendering">N/A</td>
				<td> ms</td>
			</tr>
			<tr title="Client control input (RCS, shooting, strafing, staring/ending movements) delay">
				<td class="bold">Control</td>
				<td> &nbsp; </td>
				<td class="bold right" id="info-control">N/A</td>
				<td> ms</td>
			</tr>
			<tr title="Client rotation input delay">
				<td class="bold">Rotation</td>
				<td> &nbsp; </td>
				<td class="bold right" id="info-rotation">N/A</td>
				<td> ms </td>
				<td> &plusmn; </td>
				<td class="bold right" id="info-rotation_global">N/A</td>
				<td> ms</td>
			</tr>
			<tr title="Network ping">
				<td class="bold" id="info-region">Ping</td>
				<td> &nbsp; </td>
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
		opacity: 0;
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
			let text = this[field]
			if (field != "region") text = isNaN(text) ? "N/A" : Math.round(text);
			container.querySelector("#info-" + field).innerText = text;
		}
	};

	for (let i of ["fps", "control", "rendering", "rotation", "ping", "region", "rotation_global"]) {
		Object.defineProperty(data, i, {
			get () { return this[`__${i}__`] },
			set (val) {
				if (i != "region") val = Math.round(val);
				let old = this[`__${i}__`];
				this[`__${i}__`] = val;
				if (val != old) this.update(i);
			}
		})
	}

	let lastInfo = {};
	
	setInterval(function () {
		let ping = (Object.values(main).find(v => v && v.socket) || {}).ping_value;
		if (ping != null) {
			data.ping = ping;
			if (data.region != null) data.region = `Ping (${main.region})`;
		}
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

	let holding = false, hover = false;

	document.addEventListener("keydown", function (e) {
		if (e.key == "Shift") {
			holding = !holding;
			if (holding) container.style.opacity = "1";
			else if (!hover) container.style.opacity = "0";
		}
	});

	container.addEventListener("mouseover", function (e) {
		hover = true;
		container.style.opacity = "1";
	});

	container.addEventListener("mouseout", function (e) {
		hover = false;
		if (!holding) container.style.opacity = "0";
	});

	for (let i of ["mousemove", "touchmove"]) document.addEventListener(i, function () {
		let now = performance.now();
		if (lastInfo.rotation_global != now && lastInfo.rotation_global != null) data.rotation_global = now - lastInfo.rotation_global; 
		lastInfo.rotation_global = now;
	});
})();