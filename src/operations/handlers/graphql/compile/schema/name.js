'use strict';

const { camelize } = require('underscore.string');
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
    return camelize(`_${model}`);
  }

  const commandName = getCommandName({ model, command });
  return camelize(`_${commandName}_${inputObjectType}`);
};

module.exports = {
  getCommandName,
  getTypeName,
};
