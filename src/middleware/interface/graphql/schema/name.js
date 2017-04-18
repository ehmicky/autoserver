'use strict';


const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');


// Returns type name, titleized with operation prepended, in singular form, e.g. `FindPet`, for schema type name
const getTypeName = function ({ modelName, operation: { opType = '', multiple }, inputObjectType }) {
  const model = multiple ? plural(modelName) : singular(modelName);
  return camelize(capitalize(`${opType} ${capitalize(model)} ${inputObjectType}`));
};

// Returns operation name, camelized, in plural form, e.g. `findPets` or `deletePets`
const getOperationNameFromModel = function ({ modelName, operation: { opType, multiple } }) {
  const model = multiple ? plural(modelName) : singular(modelName);
  return camelize(`${opType} ${model}`);
};


module.exports = {
  getTypeName,
  getOperationNameFromModel,
};
