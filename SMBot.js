// ==UserScript==
// @name         Starblast Modding Bot
// @namespace    http://tampermonkey.net/
// @version      1.3.1
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
      config: function(obj) {
        this.ip = (obj.ip == void 0)?"":obj.ip.replace(/\./g,"-");
        this.port = (obj.port == void 0)?"":obj.port;
        this.id = (obj.id == void 0)?"":obj.id;
      }
    },
    name: "",
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
        showLog("The bot (ID"+this.id") has been removed from the game");
        Bot.members[find(this.id)] = 0;
        refresh();
      }
      Ball.onerror = function(){
        showError("Failed to connect the bot (ID "+this.id+") to the server");
      }
      this.members.push(Ball);
      return Ball.id;
    },
    remove: function(...ids) {
      refresh();
      let members = this.members.filter(i => (i && i?.id)).map(i => i.id);
      ids = (ids.length != 0)?ids:members;
      for (let id of ids) {
        let error = "Failed to remove the bot (ID "+id+") from the game!";
        if (members.indexOf(Number(id)||0) == -1) showError(error);
        else {
          let fail = destroy(id);
          if (fail.error) showError(error);
        }
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
      name = name.toUpperCase();
      this.name = name;
      return name;
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
