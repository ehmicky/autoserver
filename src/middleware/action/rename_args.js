'use strict';

const { camelize } = require('underscore.string');

const { mapKeys } = require('../../utilities');

// Change arguments cases to camelCase
const renameArgs = function ({ actions }) {
  const actionsA = actions.map(renameActionArgs);
  return { actions: actionsA };
};

const renameActionArgs = function ({ args, ...action }) {
  const argsA = mapKeys(args, (arg, name) => camelize(name));
  return { ...action, args: argsA };
};

module.exports = {
  renameArgs,
};
