'use strict';


const { deepMerge, onlyOnce } = require('../utilities');


class LogInfo {

  constructor() {
    this[infoSym] = {};
    this.get = onlyOnce(() => this[infoSym]);
  }

  add(obj) {
    this[infoSym] = deepMerge(this[infoSym], obj);
  }

}

const infoSym = Symbol('info');


module.exports = {
  LogInfo,
};
