'use strict';

const { camelize } = require('underscore.string');

const { mapKeys } = require('../../../../utilities');

// Change arguments cases
const renameArgs = function ({ args, ...action }) {
  const argsA = mapKeys(args, (arg, name) => camelize(name));
  return { ...action, args: argsA };
};

module.exports = {
  renameArgs,
};
