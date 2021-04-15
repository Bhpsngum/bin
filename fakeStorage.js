(function(){
  var localStorage;
  try { localStorage = window.localStorage }
  catch (e) {
    var toString = function (item) {
      switch (item) {
        case null: return "null";
        case undefined: return "undefined";
        default: return item.toString();
      }
    }
    var dump = new Map();
    var props = Object.keys(Storage.prototype);
    var updateStorage = function (storage) {
      var dnames = Array.from(dump.keys());
      for (let name of Array.from(new Set([dnames,Object.keys(storage)].flat()))) {
        if (props.indexOf(name) == -1 && name != "__proto__") {
          if (dnames.indexOf(name) != -1) storage[name] = dump.get(name);
          else delete storage[name];
        }
      }
    }
    var throwError = function (name, quan, args) {
      if (args.length < quan) throw new TypeError("Failed to execute '" + name + "' on '" + Storage.name + "': " + quan + " argument" + (quan==1?"":"s") + " required, but only " + args.length + " present.");
    }
    localStorage = {
      setItem: function setItem() {
        throwError("setItem", 2, arguments);
        dump.set(toString(arguments[0]), toString(arguments[1]));
        updateStorage(this);
      },
      getItem: function getItem() {
        throwError("getItem", 1, arguments);
        return dump.get(toString(arguments[0])) || null
      },
      removeItem: function removeItem() {
        throwError("removeItem", 1, arguments);
        dump.delete(toString(arguments[0]));
        updateStorage(this);
      },
      clear: function clear() {
        dump.clear();
        updateStorage(this);
      },
      key: function key() {
        throwError("key", 1, arguments);
        return Array.from(dump.keys())[Number(arguments[0]) || 0] || null
      },
      __proto__: Storage.prototype
    }
    Object.defineProperties(localStorage, {
      length: {
        get() { return dump.size }
      }
    });
  }
  window.t = (localStorage); // global testing purpose only
})();
