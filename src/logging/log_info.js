'use strict';


const { deepMerge } = require('../utilities');


class LogInfo {

  constructor() {
    this[infoSym] = {};
  }

  add(obj) {
    this[infoSym] = deepMerge(this[infoSym], obj);
  }

}

const infoSym = Symbol('info');


module.exports = {
  LogInfo,
  infoSym,
};
