'use strict';


const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');


const nameSym = Symbol('modelName');
// Returns type name, titleized with operation prepended, in singular form, e.g. `FindPet`, for schema type name
const getTypeName = function ({ def: { model, [nameSym]: modelName }, opts: { inputObjectType, opType = '', multiple } }) {
  // Top-level methods do not have `def.model`, so use def[nameSym] instead
  model = model || modelName;
  const name = multiple ? plural(model) : singular(model);
  return camelize(capitalize(`${opType} ${name} ${inputObjectType}`));
};

// Returns operation name, camelized, in plural form, e.g. `findPets` or `deletePets`
const getOperationName = function ({ modelName, operation: { opType, multiple } }) {
  const model = multiple ? plural(modelName) : singular(modelName);
  return camelize(`${opType} ${model}`);
};


module.exports = {
  getTypeName,
  getOperationName,
  nameSym,
};
