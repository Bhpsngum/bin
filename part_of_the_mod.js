var vocabulary = [
      { text: "Hello", icon:"\u0045", key:"O" },
      { text: "Bye", icon:"\u0046", key:"B" },
      { text: "Yes", icon:"\u004c", key:"Y" },
      { text: "No", icon:"\u004d", key:"N" },
      { text: "Defend", icon:"\u0025", key:"D" },
      { text: "Kill", icon:"\u007f", key:"K" },
      { text: "Thanks", icon:"\u0041", key:"X" },
      { text: "Leader", icon:"\u002d", key:"L" },
      { text: "You", icon:"\u004e", key:"I" },
      { text: "Me", icon:"\u004f", key:"E" },
      { text: "No Problem", icon:"\u0047", key:"P" },
      { text: "Attack", icon:"\u0049", key:"A" },
      { text: "Help", icon:"\u004a", key:"H" },
      { text: "Follow Me", icon:"\u0050", key:"F" },
      { text: "Gems", icon:"\u0044", key:"J" },
      { text: "Mine", icon:"\u002f", key:"M" },
      { text: "Hmmm?", icon:"\u004b", key:"Q" },
      { text: "Love", icon:"\u0024", key:"V" },
      { text: "Sorry", icon:"\u00a1", key:"S" },
      { text: "GoodGame", icon:"\u00a3", key:"G" },
      { text: "Wait", icon:"\u0048", key:"T" },
],
colors=[0,240];
function getcolor(color)
{
  return `hsla(${color},100%,50%,1)`
}
killstats = {
    id: "info",
    position: [2.5,29,60,100],
    clickable: false,
    visible: true,
    components: []
  };
scoreboard = {
  id:"scoreboard",
  visible: true,
  components: []
};
function showkills (game,event)
{
  let s,defclr="#FFFFFF",pln={text:event.ship.name,color:getcolor(colors[event.ship.team])};
  if (Object.is(event.killer,null))
  s= [
    pln,
    {text:"committed suicide",color:defclr},
    {text:"",color:defclr}
  ];
  else
  s= [
    {text:event.killer.name,color:getcolor(colors[event.killer.team])},
    {text:"🗡️",color:defclr},
    pln
  ];
  let size=0,line=killstats.components.length/3;
  for (let i=0;i<s.length;i++)
  {
    let text = " "+s[i].text+" ";
    killstats.components.push(
      {type:"text",position:[size,(line+1)*5,text.length,20],value:text,color:s[i].color}
    );
    size+=text.length;
  }
  console.log(killstats);
  for (let ship of game.ships) ship.setUIComponent(killstats);
  setTimeout(function(){
    killstats.components.splice(0,3);
    for (let i=0;i<killstats.components.length;i++) killstats.components[i].position[1]-=5;
    for (let ship of game.ships) ship.setUIComponent(killstats);
  },5000);
}
this.options = {
  map_name:"Fucking mode",
  max_level:7,
  lives:4,
  crystal_value:5,
  asteroid_strength:0.05,
  radar_zoom:1,
  starting_ship_maxed:false,
  weapon_drop:0.25,
  max_players:40,
  weapons_store:false,
  rcs_toggle:true,
  map_size:40,
  friendly_colors:2,
  root_mode:"",
  vocabulary:vocabulary,
  hues:colors,
  soundtrack:"argon.mp3"
};
PlayerBox = function(posx,posy) {
  return { type:"box",position:[posx,posy,50,7],fill:"#384A5C",width:2};
};
Tag = function(indtext,param,posx,posy,hex,al,size) {
  let obj= {type: indtext,position: [posx,posy,50-(size||0),5],color: hex,align:al};
  switch(indtext) {
    case "text":
      obj.value=param;
      break;
    case "player":
      obj.id=param;
      break;
  }
  return obj;
};
sort = function(arr) {
  let array=[...arr],i=0;
  while (i<array.length-1) {
    if (array[i].score<array[i+1].score) {
      array[i+1]=[array[i],array[i]=array[i+1]][0];
      if (i>0) i-=2;
    }
    i++;
  }
  return array;
};
function updatescoreboard(game)
{
  let t=[[],[]];
  for (let ship of game.ships) t[ship.team].push(ship);
  scoreboard.components = [
    { type:"box",position:[0,0,50,8],fill:getcolor(colors[0])},
    { type: "text",position: [0,0,50,8],color: "#FFF",value: "Red"},
    { type:"box",position:[50,0,50,8],fill:getcolor(colors[1])},
    { type: "text",position: [50,0,50,8],color: "#FFF",value: "Blue"}
  ];
  let sc=[sort(t[0]),sort(t[1])],line=1;
  sc[0].slice(10);sc[1].slice(10);
  for (let i=0;i<10;i++)
  {
    for (let j=0;j<2;j++)
    {
      if (sc[j][i]) scoreboard.components.push(
        new Tag("text",sc[j][i].score,j*50,line*10,"#FFFFFF","right",2),
        new Tag("player",sc[j][i].id,j*50,line*10,"#FFFFFF","left")
      );
      else scoreboard.components.push({},{});
    }
    line++;
  }
  console.log(scoreboard);
  outputscoreboard(game,sc)
}
function outputscoreboard(game,tm)
{
  let origin =[...scoreboard.components]
  for (let ship of game.ships)
  {
    let j=0,team=tm[ship.team];
    for (j=0;j<team.length;j++)
    {
      if (ship.id === team[j].id)
      {
        console.log((j*2+ship.team)*2+1);
        scoreboard.components.splice((j*2+ship.team)*2+4,0,
          new PlayerBox(ship.team*50,(j+1)*10)  
        );
        break;
      }
    }
    if (j == team.length) scoreboard.components.splice((20+ship.team)*2,2,
        new PlayerBox(ship.team*50,90),
        new Tag("text",ship.score,ship.team*50,90,ship.team,"right",2),
        new Tag("player",ship.id,ship.team*50,90,ship.team,"left")
    );
    ship.setUIComponent(scoreboard);
    console.log(JSON.stringify(scoreboard));
    scoreboard.components = [...origin];
  }
}

this.tick = function (game) {
  for (let ship of game.ships) {
    if (!ship.custom.init) {
      ship.custom.init=true;
      ship.frag=0;
      ship.death=0;
      updatescoreboard(game);
    }
    ship.set({score:ship.frag})
  }
}
this.event = function (event,game) {
  switch (event.name)
  {
    case "ship_destroyed":
      showkills(game,event);
      if (!Object.is(event.killer,null)) event.killer.frag++;
      event.ship.death++;
      updatescoreboard(game);
      console.log(event);
  }
}
