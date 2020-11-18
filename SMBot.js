// ==UserScript==
// @name         Starblast Modding Bot
// @namespace    http://tampermonkey.net/
// @version      1.4.0
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
        u.open('GET',"https:/starblast.io/simstatus.json");
        u.onreadystatechange = function(){
          if (u.readyState == 4 && u.status == 200 && typeof func == "function") func.call(window, JSON.parse(u.responseText).filter(i => {
              let t = i.address.split(":");
              return (!obj.location || obj.location === i.location) && (!obj.ip || obj.ip==t[0].replace(/-/g,".")) && (!obj.port || obj.port==t[1])
            }).map(i => i.systems.map(j => Object.assign(j,function(){
              let t = i.address.split(":");
              return {
                location:i.location,
                ip:t[0].replace(/-/g,"."),
                port:parseInt(t[1])
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
        this.ip = (obj.ip == void 0)?"":obj.ip.replace(/\./g,"-");
        this.port = (obj.port == void 0)?"":obj.port;
        this.id = (obj.id == void 0)?"":obj.id;
        return {ip:this.ip,port:this.port,id:this.id}
      }
    },
    name: "",
    create: function() {
      refresh();
      let Ball = new WebSocket("wss://"+this.address.ip+".starblast.io:"+this.address.port+"/");
      Ball.id = request_id++;
      Ball.logs = !!this.logs;
      Ball.onopen = function(){
        this.send('{"name":"join","data":{"mode":"survival","spectate":false,"spectate_ship":1,"player_name":"'+(Bot.name.toUpperCase()||"DUMMY")+' '+this.id+'","hue":288,"preferred":'+Bot.address.id+',"bonus":false,"ecp_key":null,"steamid":null,"ecp_custom":{"badge":"star","finish":"alloy","laser":"1"},"create":false,"client_ship_id":"425271352936625943","client_tr":1}}');
        this.send('{"name":"enter","data":{"spectate":false}}');
        this.send('{"name":"respawn"}');
      }
      Ball.onclose = function() {
        (this.logs && !this.error) && showLog("The bot (ID "+this.id+") has been removed from the game!");
        Bot.members[find(this.id)] = 0;
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
      let members = this.members.filter(i => (i && (i||{}).id != null)).map(i => i.id);
      ids = (ids.length != 0)?ids:members;
      for (let id of ids) {
        let error = "Failed to remove the bot (ID "+id+") from the game!";
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
      refresh();
      this.members.forEach(i => {i.logs = this.logs});
      return this.logs;
    },
    members: []
  };
  var find = function(id) {
    for (let i=0;i<Bot.members.length;i++) {
      if (Bot.members[i]?.id === id) return i;
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
          bot.close();
          Bot.members[index] = 0;
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
