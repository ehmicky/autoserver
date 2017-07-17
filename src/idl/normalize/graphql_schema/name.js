'use strict';

const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');

const nameSym = Symbol('modelName');

// Returns type name, titleized with action prepended, in singular form,
// e.g. `FindPet`, for schema type name
const getTypeName = function ({ def, opts: { inputObjectType, action = {} } }) {
  const { model, [nameSym]: modelName } = def;
  // Top-level graphqlMethods do not have `def.model`,
  // so use def[nameSym] instead
  const actualModel = model || modelName;
  const name = action.multiple ? plural(actualModel) : singular(actualModel);
  const nestedPostfix = def.isTopLevel ? '' : ' Nested';
  const typeName = `${action.type || ''} ${name} ${inputObjectType}${nestedPostfix}`;
  return camelize(capitalize(typeName));
};

// Returns action name, camelized, in plural form,
// e.g. `findPets` or `deletePets`
const getActionName = function ({ modelName, action, noChange }) {
  const model = noChange
    ? modelName
    : action.multiple ? plural(modelName) : singular(modelName);
  return camelize(`${action.type} ${model}`);
};

module.exports = {
  getTypeName,
  getActionName,
  nameSym,
};
