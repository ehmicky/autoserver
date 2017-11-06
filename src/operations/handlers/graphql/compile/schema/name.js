'use strict';

const { capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');

// Returns top-level command name, e.g. `find_models` or `delete_models`
const getCommandName = function ({ model, command }) {
  const modelA = command.multiple ? plural(model) : singular(model);
  return `${command.type}_${modelA}`;
};

// Returns type name:
//  - 'Model' for normal return types
//  - 'CommandModelData' and 'CommandModelFilter' for `args.data|filter` types
const getTypeName = function ({
  def: { model, command },
  opts: { inputObjectType = 'type' } = {},
}) {
  if (inputObjectType === 'type') {
    return capitalize(model);
  }

  const modelA = singular(model);
  return capitalize(`${command.type}_${modelA}_${inputObjectType}`);
};

module.exports = {
  getCommandName,
  getTypeName,
};
