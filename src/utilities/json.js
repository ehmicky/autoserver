'use strict';

const {
  stringify: circularStringify,
  parse: circularParse,
} = require('circular-json');

// Like JSON.stringify|parse() but handle circular references
const stringifyJSON = function (val, { replacer, spaces } = {}) {
  return circularStringify(val, replacer, spaces);
};

const parseJSON = function (val, { replacer } = {}) {
  return circularParse(val, replacer);
};

module.exports = {
  stringifyJSON,
  parseJSON,
};
