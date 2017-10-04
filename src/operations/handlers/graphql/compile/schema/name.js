'use strict';

const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');

// Returns top-level command name, e.g. `find_models` or `delete_models`
const getCommandName = function ({ modelName, command }) {
  const modelNameA = command.multiple ? plural(modelName) : singular(modelName);
  return `${command.type}_${modelNameA}`;
};

// Returns type name, titleized with command prepended, in singular form,
// e.g. `FindModel`, for schema type name
const getTypeName = function ({
  def: { commandName, model },
  opts: { inputObjectType },
}) {
  const name = inputObjectType === 'type'
    ? model
    : `${commandName} ${inputObjectType}`;
  const nameA = capitalize(name);
  return camelize(nameA);
};

module.exports = {
  getCommandName,
  getTypeName,
};
