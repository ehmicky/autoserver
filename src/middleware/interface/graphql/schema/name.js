'use strict';


const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');

const { EngineError } = require('../../../../error');
const { stringify } = require('circular-json');


const pluralize = function ({ name, asPlural }) {
  return asPlural ? plural(name) : singular(name);
};

// Returns def.propName, in plural|singular form
const getName = function ({ def, asPlural = true, inputObjectType, modelName = def.model } = {}) {
  if (!modelName) {
    throw new EngineError(`Missing model name in definition ${stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  if (typeof modelName !== 'string') {
    throw new EngineError(`Model name must be a string in definition ${stringify(def)}`, {
      reason: 'GRAPHQL_WRONG_DEFINITION',
    });
  }
  const name = modelName + (capitalize(inputObjectType) || '');
  return pluralize({ name, asPlural });
};

// Returns propName, titleized with operation prepended, in singular form, e.g. `FindPet`, for schema type name
const getTypeName = function ({ def, inputObjectType, topLevelDef, propName }) {
  let name = getName({ def, asPlural: false, inputObjectType, modelName: propName });
  name = capitalize(name);
  // Means it is a submodel, i.e. should prepend top-level name
  if (topLevelDef && topLevelDef.propName !== def.propName) {
    name = capitalize(topLevelDef.propName) + name;
  }
  name = camelize(name);
  return name;
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
