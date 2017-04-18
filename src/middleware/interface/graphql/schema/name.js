'use strict';


const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');


const pluralize = function ({ name, asPlural }) {
  return asPlural ? plural(name) : singular(name);
};

// Returns def.propName, in plural|singular form
const getName = function ({ def, asPlural = true, inputObjectType, modelName = def.model } = {}) {
  const name = modelName + (capitalize(inputObjectType) || '');
  return pluralize({ name, asPlural });
};

// Returns propName, titleized with operation prepended, in singular form, e.g. `FindPet`, for schema type name
const getTypeName = function ({ def, inputObjectType, propName }) {
  const name = getName({ def, asPlural: false, inputObjectType, modelName: propName });
  return camelize(capitalize(name));
};

// Returns operation name, camelized, in plural form, e.g. `findPets` or `deletePets`
const getOperationNameFromModel = function ({ def, opType, asPlural = true } = {}) {
  const name = getName({ def, asPlural });
  return camelize(`${opType} ${name}`);
};


module.exports = {
  getTypeName,
  getOperationNameFromModel,
};
