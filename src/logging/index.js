'use strict';


const { deepMerge } = require('../utilities');


class LogInfo {

  constructor() {
    this.info = {};
  }

  add(obj) {
    this.info = deepMerge(this.info, obj);
  }

  // TODO: maybe allow this only once
  get() {
    return this.info;
  }

}


module.exports = {
  LogInfo,
};
