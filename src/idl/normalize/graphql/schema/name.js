'use strict';

const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');

const nameSym = Symbol('modelName');

// Returns type name, titleized with action prepended, in singular form,
// e.g. `FindPet`, for schema type name
const getTypeName = function ({
  def: { model, [nameSym]: modelName, isTopLevel },
  opts: { inputObjectType, action: { type: actionType = '', multiple } = {} },
}) {
  // Top-level graphqlMethods do not have `def.model`,
  // so use def[nameSym] instead
  const actualModel = model || modelName;
  const name = multiple ? plural(actualModel) : singular(actualModel);
  const nestedPostfix = isTopLevel ? '' : 'nested';
  const typeName = `${actionType} ${name} ${inputObjectType} ${nestedPostfix}`;
  return camelize(capitalize(typeName));
};

const getActionName = function ({ modelName, action }) {
  return camelize(`${action.type} ${modelName}`);
};

// Returns action name, camelized, in plural form,
// e.g. `findPets` or `deletePets`
const getPluralActionName = function ({ modelName, action }) {
  const pluralModelName = pluralizeModel({ modelName, action });
  return getActionName({ modelName: pluralModelName, action });
};

const pluralizeModel = function ({ modelName, action: { multiple } }) {
  if (multiple) { return plural(modelName); }
  return singular(modelName);
};

module.exports = {
  getTypeName,
  getPluralActionName,
  getActionName,
  nameSym,
};
