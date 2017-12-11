'use strict';

const { mapValues } = require('../../../utilities');

const maps = require('./maps');

// Startup transformations just meant for runtime performance optimization
const normalizeShortcuts = function ({ schema }) {
  const shortcuts = mapValues(maps, func => func({ schema }));
  return { shortcuts };
};

module.exports = {
  normalizeShortcuts,
};
