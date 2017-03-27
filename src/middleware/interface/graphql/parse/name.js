'use strict';


const titleize = require('underscore.string/titleize');
const camelize = require('underscore.string/camelize');
const { plural, singular } = require('pluralize');

const { EngineError } = require('../../../../error');


// Returns def.title, in plural|singular form
const getName = function (def, { asPlural = true, isInputObject = false } = {}) {
	const inputObjectType = isInputObject ? '-input' : '';
  const name = def.title + inputObjectType;
  if (!name) {
    throw new EngineError(`Missing "title" key in definition ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  if (typeof def.title !== 'string') {
    throw new EngineError(`"title" must be a string in definition ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  return asPlural ? plural(name) : singular(name);
};

// Returns def.title, in plural|singular form, lowercased, e.g. `pets|pet`, for findMany|findOne operation
const getDefinitionName = function (def, { asPlural = true }) {
  const name = getName(def, { asPlural });
  return name.toLowerCase();
};

// Returns operation name, camelized, in plural form, e.g. `findPets` or `deletePets`
const getOperationName = function (def, operation, { asPlural = true } = {}) {
  const name = getName(def, { asPlural });
  return camelize(`${operation} ${name}`);
};

// Returns def.title, titleized with operation prepended, in singular form, e.g. `FindPet`, for schema type name
const getTypeName = function ({ def, operation = '', isInputObject = false }) {
  let name = getName(def, { asPlural: false, isInputObject });
  name = operation ? camelize(name) : titleize(name);
  return camelize(`${titleize(operation)} ${name}`);
};


module.exports = {
  getDefinitionName,
  getOperationName,
  getTypeName,
};