'use strict';

const { formatAdapters } = require('./merger');

// All possible extensions, for documentation
const getExtNames = function () {
  return Object.values(formatAdapters)
    .filter(({ extNames }) => Array.isArray(extNames) && extNames.length > 0)
    .map(({ extNames: [extName] }) => extName);
};

const EXT_NAMES = getExtNames();

module.exports = {
  EXT_NAMES,
};
