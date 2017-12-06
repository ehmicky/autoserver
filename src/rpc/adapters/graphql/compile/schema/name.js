'use strict';

const { camelize, capitalize } = require('underscore.string');

// Returns top-level command name, e.g. `find_collection` or `delete_collection`
const getCommandName = function ({ clientCollname, command }) {
  return `${command}_${clientCollname}`;
};

// Returns type name:
//  - 'Model' for normal return types
//  - 'CommandCollData' and 'CommandCollFilter' for `args.data|filter` types
const getTypeName = function ({
  def: { clientCollname, command },
  opts: { inputObjectType = 'type' } = {},
}) {
  const typeName = inputObjectType === 'type'
    ? clientCollname
    : `${command}_${clientCollname}_${inputObjectType}`;
  const typeNameA = camelize(capitalize(typeName));
  return typeNameA;
};

module.exports = {
  getCommandName,
  getTypeName,
};
