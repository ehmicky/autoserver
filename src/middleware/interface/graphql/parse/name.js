'use strict';


const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');

const { EngineError } = require('../../../../error');
const { recursivePrint } = require('../../../../utilities');


const pluralize = function ({ name, asPlural }) {
  return asPlural ? plural(name) : singular(name);
};

// Returns def.title, in plural|singular form
const getName = function ({ def, asPlural = true, inputObjectType } = {}) {
	const inputObjectTypeName = inputObjectType === 'input' ? ' input' : (inputObjectType === 'filter' ? ' filter' : '');
  if (typeof def.title !== 'string') {
    throw new EngineError(`"title" must be a string in definition ${recursivePrint(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  const name = def.title + inputObjectTypeName;
  if (!name) {
    throw new EngineError(`Missing "title" key in definition ${recursivePrint(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  return pluralize({ name, asPlural });
};

// Returns def.title, titleized with operation prepended, in singular form, e.g. `FindPet`, for schema type name
const getTypeName = function ({ def, inputObjectType, topLevelDef }) {
  let name = getName({ def, asPlural: false, inputObjectType });
  name = capitalize(name);
  // Means it is a submodel, i.e. should prepend top-level name
  if (topLevelDef && topLevelDef.title !== def.title) {
    name = capitalize(topLevelDef.title) + name;
  }
  name = camelize(name);
  return name;
};

// Returns operation name, camelized, in plural form, e.g. `findPets` or `deletePets`
const getOperationNameFromModel = function ({ def, opType, asPlural = true } = {}) {
  const name = getName({ def, asPlural });
  return camelize(`${opType} ${name}`);
};

// Returns operation name, camelized, in plural form, e.g. `findPets` or `deletePets`
const getOperationNameFromAttr = function ({ name, opType, asPlural = true } = {}) {
  const pluralizedName = pluralize({ name, asPlural });
  return camelize(`${opType} ${pluralizedName}`);
};


module.exports = {
  getTypeName,
  getOperationNameFromModel,
  getOperationNameFromAttr,
};