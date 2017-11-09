'use strict';

const { camelize, capitalize } = require('underscore.string');

// Returns top-level command name, e.g. `find_models` or `delete_models`
const getCommandName = function ({ model, command }) {
  return `${command}_${model}`;
};

// Returns type name:
//  - 'Model' for normal return types
//  - 'CommandModelData' and 'CommandModelFilter' for `args.data|filter` types
const getTypeName = function ({
  def: { model, command },
  opts: { inputObjectType = 'type' } = {},
}) {
  const typeName = inputObjectType === 'type'
    ? model
    : `${command}_${model}_${inputObjectType}`;
  const typeNameA = camelize(capitalize(typeName));
  return typeNameA;
};

module.exports = {
  getCommandName,
  getTypeName,
};
