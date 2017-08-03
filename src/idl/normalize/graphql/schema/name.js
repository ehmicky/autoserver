'use strict';

const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');

// Returns type name, titleized with action prepended, in singular form,
// e.g. `FindPet`, for schema type name
const getTypeName = function ({
  def: { name, isTopLevel },
  opts: { inputObjectType, action: { type: actionType = '', multiple } = {} },
}) {
  // Top-level graphqlMethods do not have `def.model`,
  // so use def[nameSym] instead
  const nameA = multiple ? plural(name) : singular(name);
  const nestedPostfix = isTopLevel ? '' : 'nested';
  const nameB = `${actionType} ${nameA} ${inputObjectType} ${nestedPostfix}`;
  const nameC = capitalize(nameB);
  return camelize(nameC);
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
};
