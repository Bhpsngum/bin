try {
  let u = module.exports, t = u.settings, data, mode, anonymous_hue = 60,
  setHue = function(prop) {
    prop.hue = anonymous_hue;
  }, getVal = function(obj, dirarr) {
    let t = obj;
    for (let i of dirarr) t = t[i];
    return t;
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
  data.names.getData = function(u){
    let x = tx(u);
    x && setHue(x);
    return x
  }
  ty.toString().replace(/this\.(((?!(this)).)+?)\.hue/, function(...v){stat=v[1].split(".")});
  Pods.prototype.getModelInstance = function(t) {
    setHue(getVal(this, stat));
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
  for (let i in mode.team.station_model) {
    if (mode.team.station_model[i].type == "Group") {
      rev = i;
      break;
    }
  }
  for (let i in data) {
    if (data[i].seed) {
      for (let j in data[i]) {
        if (Array.isArray(data[i][j].stations)) {
          add = data[i][j];
          break;
        }
      }
      break;
    }
  }
  if (mode.id == "team") {
    for (let team of mode.teams) team.station_model[rev].remove(...team.station_model.modules.map(i => i[rev]))
    add.stations = [];
    for (let team of mode.teams) {
      team.station_model = new StationModel(team.station_desc, team);
      add.addStation(team.station_model);
    }
  }
}
catch(e){console.log(e)};
