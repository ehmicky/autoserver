'use strict';


// General key-value cache
class GeneralCache {

  constructor() {
    this._data = {};
  }

  get(key) {
    return this._data[key];
  }

  exists(key) {
    return key && this.get(key) != null;
  }

  set(key, value) {
    this._data[key] = value;
  }

};


module.exports = {
  GeneralCache,
};
