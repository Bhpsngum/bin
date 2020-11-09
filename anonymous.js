try {
  let u = module.exports, t = u.settings, data, mode, anonymous_hue = 60,
  setHue = function(prop) {
    prop.hue = anonymous_hue;
  }
  for (let i in t)
    if (t[i].settings) {
      data = t[i];
      mode = data.mode;
      break;
    }
  mode.anonymous_ships = true;
  for (let i=0;i<mode.teams.length;i++) {
    setHue(mode.teams[i].station_desc);
    setHue(mode.teams[i]);
    setHue(mode.options.teams[i]);
  }
  let tx = data.names.getData.bind(data.names), ty = Pods.prototype.getModelInstance, tz = Mine.prototype.read, tw = Rocket.prototype.read, rev, add, stat;
  if (window.location.pathname == "/app.html") {
    rev = "l0OO1";
    add = data.I1l11.IO000;
    stat = "ll0l1";
  }
  else {
    rev = "OIOOI";
    add = data.I110O.I11I0;
    stat = "l1OlO"
  }
  data.names.getData = function(u){
    let x = tx(u);
    x && setHue(x);
    return x
  }
  Pods.prototype.getModelInstance = function(t) {
    setHue(this[stat].status);
    return ty.bind(this)(t);
  }
  Mine.prototype.read = function(t) {
    let x = tz.bind(this)(t);
    setHue(this);
    return x;
  }
  Rocket.prototype.read = function(t) {
    let x = tw.bind(this)(t);
    setHue(this);
    return x;
  }
  for (let team of mode.teams) team.station_model[rev].remove(...team.station_model.modules.map(i => i[rev]))
  add.stations = [];
  for (let team of mode.teams) {
    team.station_model = new StationModel(team.station_desc, team);
    add.addStation(team.station_model)
  }
}
catch(e){console.log(e)};
