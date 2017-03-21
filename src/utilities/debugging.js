'use strict';


// So that we can require from dev tools console
const attachRequire = function () {
  global.require = require;
};


module.exports = {
  attachRequire,
};