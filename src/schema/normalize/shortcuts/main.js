'use strict';

const { assignObject } = require('../../../utilities');

const maps = require('./maps');
const { mapModels } = require('./helper');

// Compile-time transformations just meant for runtime performance optimization
const normalizeShortcuts = function ({ schema }) {
  const shortcuts = Object.entries(maps)
    .map(([name, input]) => {
      const shortcut = mapModels({ schema }, input);
      return { [name]: shortcut };
    })
    .reduce(assignObject, {});
  return { ...schema, shortcuts };
};

module.exports = {
  normalizeShortcuts,
};
