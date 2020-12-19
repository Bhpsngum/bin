// ==UserScript==
// @name         Starblast Modding Bot
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description  Make some ships join your created game!
// @author       Bhpsngum
// @match        https://starblast.data.neuronality.com/modding/moddingcontent.html
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  let request_id = 1;
  window.Bot = {
    address: {
      ip: "",
      port: "",
      id: "",
      search: function (obj, func) {
        obj = obj || {};
        var u = new XMLHttpRequest();
        u.open('GET',"https://starblast.io/simstatus.json");
        u.onreadystatechange = function(){
          if (u.readyState == 4 && u.status == 200 && typeof func == "function") func.call(window, JSON.parse(u.responseText).filter(i => {
              let t = i.address.split(":");
              return (!obj.location || obj.location === i.location) && (!obj.ip || obj.ip==t[0].replace(/-/g,".")) && (!obj.port || obj.port==t[1])
            }).map(i => i.systems.map(j => Object.assign(j,function(){
              let t = i.address.split(":");
              return {
                location: i.location,
                ip: t[0].replace(/-/g,"."),
                port: parseInt(t[1])
              }
            }()))).flat().filter(i => (!obj.id || obj.id == i.id) && (!obj.name || obj.name == i.name) && (!obj.mode || obj.mode == i.mode) && (!obj.mod_id || obj.mod_id == i.mod_id)).map(i => {
              let c = {
                location: i.location,
                ip: i.ip,
                port: i.port,
                id: i.id,
                name: i.name,
                mode: i.mode,
                mod_id: i.mod_id
              };
              if (!c.mod_id) delete c.mod_id;
              return c;
            }));
          }
        u.send(null);
      },
      config: function(obj) {
        obj = obj || {};
        if (typeof obj == "string") {
          obj = obj.split("#")[1];
          let t = obj.split("@");
          obj = {
            id: t[0],
            ip: t[1].split(":")[0],
            port: t[1].split(":")[1]
          }
        }
        this.ip = (obj.ip == void 0)?"":(obj.ip||this.ip).replace(/\./g,"-");
        this.port = parseInt((obj.port == void 0)?"":obj.port)||this.port;
        this.id = parseInt((obj.id == void 0)?"":obj.id)||this.id;
        return {
          ip: this.ip,
          port: this.port,
          id: this.id
        }
      }
    },
    name: "",
    logs: !0,
    create: function() {
      refresh();
      let Ball = new WebSocket("wss://"+this.address.ip+".starblast.io:"+this.address.port+"/");
      Ball.id = request_id++;
      Ball.onopen = function(){
        this.send('{"name":"join","data":{"mode":"survival","spectate":false,"spectate_ship":1,"player_name":"'+(Bot.name.toUpperCase()||"DUMMY")+' '+this.id+'","hue":288,"preferred":'+Bot.address.id+',"bonus":false,"ecp_key":null,"steamid":null,"ecp_custom":{"badge":"star","finish":"alloy","laser":"1"},"create":false,"client_ship_id":"425271352936625943","client_tr":1}}');
        this.send('{"name":"enter","data":{"spectate":false}}');
        this.send('{"name":"respawn"}');
      }
      Ball.onclose = function() {
        (Bot.logs && !this.error) && showLog("The bot (ID "+this.id+") has been removed from the game!");
        let index = find(this.id);
        if (index != null) Bot.members[index] = 0;
        refresh();
      }
      Ball.onerror = function(){
        showError("Failed to connect the bot (ID "+this.id+") to the server!");
        this.error = !0;
      }
      this.members.push(Ball);
      return Ball.id;
    },
    remove: function(...ids) {
      refresh();
      let members = this.members.map(i => i.id);
      ids = [...new Set((ids.length != 0)?ids:members)];
      for (let id of ids) {
        let error = "The bot (ID "+id+") does not exist!";
        if (members.indexOf(Number(id)||0) == -1) showError(error);
        else destroy(id).fail && showError(error);
      }
    },
    setName: function(name) {
      switch (name) {
        case void 0:
          name = "undefined";
          break;
        case null:
          name = "null";
          break;
        default:
          name = name.toString();
      }
      this.name = name.toUpperCase();
      return this.name;
    },
    showLogs: function(bool) {
      this.logs = !!bool;
      return this.logs;
    },
    members: []
  };
  var find = function(id) {
    id = id || 0;
    for (let i=0;i<Bot.members.length;i++) {
      if ((Bot.members[i]||{}).id === id) return i;
    }
    return null;
  }
  var refresh = function() {
    Bot.members = Bot.members.filter(bot => bot instanceof WebSocket);
  }
  var destroy = function(id) {
    let destroyed = !1, error = !1;
    try {
      Bot.members.forEach((bot,index) => {
        if (bot.id === id && !destroyed) {
          switch (bot.readyState) {
            case WebSocket.CONNECTING:
              bot.onopen = function(){bot.close()};
              break;
            case WebSocket.OPEN:
              bot.close();
              break;
            case WebSocket.CLOSING:
            case WebSocket.CLOSED:
              break;
          }
          destroyed = !0;
        }
      });
    }
    catch(e){error=!!e};
    refresh();
    return {error:error}
  }
  var showError = function(message) {
    try {
      console.error(message);
      $("#terminal").terminal().error(message);
    }
    catch(e){}
  }
  var showLog = function(message) {
    try {
      console.log(message);
      $("#terminal").terminal().echo(message);
    }
    catch(e){}
  }
  for (let i in window) try {
    if (window[i].prototype.modStarted && i != "Modding")
      window[i].prototype.modStarted = function (t) {
        Bot.address.id = t.id;
        let e = this.address.split(":");
        Bot.address.ip = e[0].replace(/\./g,"-");
        Bot.address.port = e[1];
        return this.modding.game.options=t.options,this.modding.modStarted(t.id+"@"+this.address);
      }
  }catch(e){}
})();
