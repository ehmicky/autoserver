'use strict';

const { mapValues } = require('../../../utilities');

const maps = require('./maps');

// Startup transformations just meant for runtime performance optimization
const normalizeShortcuts = function ({ config }) {
  const shortcuts = mapValues(maps, func => func({ config }));
  return { shortcuts };
};

module.exports = {
  normalizeShortcuts,
};
