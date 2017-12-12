'use strict';

const formats = require('./adapters');

// All possible extensions, for documentation
const getExtNames = function () {
  return formats
    .filter(({ extNames }) => Array.isArray(extNames) && extNames.length > 0)
    .map(({ extNames: [extName] }) => extName);
};

module.exports = {
  getExtNames,
};
