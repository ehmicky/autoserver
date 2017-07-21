'use strict';

const { assignObject } = require('../../../utilities');

const maps = require('./maps');
const { mapModels } = require('./helper');

// Compile-time transformations just meant for runtime performance optimization
const normalizeShortcuts = function ({ idl, idl: { models } }) {
  const shortcuts = Object.entries(maps)
    .map(([name, input]) => {
      const shortcut = mapModels({ models }, input);
      return { [name]: shortcut };
    })
    .reduce(assignObject, {});
  const newIdl = Object.assign({}, idl, { shortcuts });
  return newIdl;
};

module.exports = {
  normalizeShortcuts,
};
