'use strict';


const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');


const nameSym = Symbol('modelName');
// Returns type name, titleized with action prepended, in singular form, e.g. `FindPet`, for schema type name
const getTypeName = function ({ def, opts: { inputObjectType, action: { opType = '', multiple } = {} } }) {
  const { model, [nameSym]: modelName } = def;
  // Top-level methods do not have `def.model`, so use def[nameSym] instead
  const actualModel = model || modelName;
  const name = multiple ? plural(actualModel) : singular(actualModel);
  const nestedPostfix = !def.isTopLevel ? ' Nested' : '';
  return camelize(capitalize(`${opType} ${name} ${inputObjectType}${nestedPostfix}`));
};

// Returns action name, camelized, in plural form, e.g. `findPets` or `deletePets`
const getActionName = function ({ modelName, opType, multiple }) {
  const model = multiple === true ? plural(modelName) : multiple === false ? singular(modelName) : modelName;
  return camelize(`${opType} ${model}`);
};


module.exports = {
  getTypeName,
  getActionName,
  nameSym,
};
