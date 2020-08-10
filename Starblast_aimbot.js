// MADE BY WIGWAM THE PUDD AND MODIFIED BY BHPSNGUM
// THE SECOND PLAYER IS THE AIM BOT,
// WHICH FOLLOWS THE FIRST

this.options = {
  // see documentation for options reference
  max_players: 2,
  root_mode: "",
  map_size: 30
};
this.tick = function(game) {
  // do mod stuff here ; see documentation
  
  //Remove this line to increase accuracy but it gets laggy
  (game.step % 5 === 0 && game.ships[1]) && adjust_angle(game.ships[1]);
}
var shortestXY = function(x1, y1, x2, y2){
  let corners = [[1,1],[-1,1],[-1,-1],[1,-1]];
  var size = (this.options.map_size||30)*5,distX = Math.abs(x2-x1), distY = Math.abs(y2-y1);
  let minX = Math.min(distX,size*2-distX);
  let minY = Math.min(distY,size*2-distY);
  for (let i of corners)
  {
    let x = x1+i[0]*minX, y = y1+i[1]*minY;
    let xm = (Math.abs(x) > size)?(-1*Math.sign(x)*(size*2-Math.abs(x))):((Math.abs(x) == size)?x2:x);
    let ym = (Math.abs(y) > size)?(-1*Math.sign(y)*(size*2-Math.abs(y))):((Math.abs(y) == size)?y2:y);
    if (xm == x2 && ym == y2) return {x:x,y:y};
  }
}.bind(this);
var adjust_angle = function (ship) {
  let target = game.ships[0];
  let sp = shortestXY(ship.x,ship.y,target.x,target.y);
  let distX = ship.x - sp.x;
  let distY = ship.y - sp.y;
  targ_angle = (Math.atan2(distY, distX)) * (180 / Math.PI) - 180;
  if (targ_angle < 0) targ_angle += 360;
  ship.set({angle:targ_angle});
}
