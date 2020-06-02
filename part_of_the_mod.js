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
colors=[0,180];
killstats = {
    id: "info",
    position: [2.5,29,60,100],
    clickable: false,
    visible: true,
    components: []
  };
var scoreboard = {
  id:"scoreboard",
  visible: true,
  components: []
};
function showkills (game,event)
{
  let s,defclr="#FFFFFF",pln={text:event.ship.name,color:`hsla(${colors[event.ship.team]},100%,50%,1)`};
  if (Object.is(event.killer,null))
  s= [
    pln,
    {text:"committed suicide",color:defclr},
    {text:"",color:defclr}
  ];
  else
  s= [
    {text:event.killer.name,color:`hsla(${colors[event.killer.team]},100%,50%,1)`},
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
this.tick = function (game) {
  if (game.step % 300 === 0) {
    killstats.components.splice(0,3);
    for (let i=0;i<killstats.components.length;i++) killstats.components[i].position[1]-=5;
    for (let ship of game.ships) ship.setUIComponent(killstats);
  }
}
this.event = function (event,game) {
  switch (event.name)
  {
    case "ship_destroyed":
      showkills(game,event);
      console.log(event);
  }
}
