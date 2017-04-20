'use strict';


const { stringify: circularStringify } = require('circular-json');


const stringify = function (val, { replacer, spaces } = {}) {
  return circularStringify(val, replacer, spaces);
};


module.exports = {
  stringify,
};
