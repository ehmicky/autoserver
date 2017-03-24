'use strict';


const titleize = require('underscore.string/titleize');
const camelize = require('underscore.string/camelize');
const { plural, singular } = require('pluralize');

const { EngineError } = require('../../../../error');


// Returns def.title, in plural|singular form, lowercased, e.g. `pets|pet`, for findMany|findOne operation
const getDefinitionName = function (def, { asPlural = true } = {}) {
  const name = def.title;
  if (!name) {
    throw new EngineError(`Missing "title" key in definition ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  if (typeof def.title !== 'string') {
    throw new EngineError(`"title" must be a string in definition ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  const pluralizedName = asPlural ? plural(name) : singular(name);
  return pluralizedName.toLowerCase();
};

// Returns operation name, camelized, in plural form, e.g. `findPets` or `deletePets`
const getOperationName = function (def, operation, { asPlural = true } = {}) {
  const name = getDefinitionName(def, { asPlural });
  return camelize(`${operation} ${name}`);
};

// Returns def.title, titleized with operation prepended, in singular form, e.g. `FindPet`, for schema type name
const getTypeName = function (def, operation = '') {
  const name = getDefinitionName(def, { asPlural: false });
  return camelize(`${titleize(operation)} ${titleize(name)}`);
};


module.exports = {
  getDefinitionName,
  getOperationName,
  getTypeName,
};
