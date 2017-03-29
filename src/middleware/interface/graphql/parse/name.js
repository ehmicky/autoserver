'use strict';


const titleize = require('underscore.string/titleize');
const camelize = require('underscore.string/camelize');
const { plural, singular } = require('pluralize');

const { EngineError } = require('../../../../error');
const { getSubDefProp } = require('./utilities');


const pluralize = function ({ name, asPlural }) {
  return asPlural ? plural(name) : singular(name);
};

// Returns def.title, in plural|singular form
const getName = function ({ def, asPlural = true, inputObjectType } = {}) {
	const inputObjectTypeName = inputObjectType === 'input' ? ' input' : (inputObjectType === 'filter' ? ' filter' : '');
  const name = def.title + inputObjectTypeName;
  if (!name) {
    throw new EngineError(`Missing "title" key in definition ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  if (typeof def.title !== 'string') {
    throw new EngineError(`"title" must be a string in definition ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  return pluralize({ name, asPlural });
};

// Returns def.title, titleized with operation prepended, in singular form, e.g. `FindPet`, for schema type name
const getTypeName = function ({ def, opType = '', inputObjectType }) {
  let name = getName({ def, asPlural: false, inputObjectType });
  name = opType ? camelize(name) : titleize(name);
  return camelize(`${titleize(opType)} ${name}`);
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

// Returns reverse id (foreign key) names, by using def.reverse_id or def.items.reverse_id
// Defaults to parentdef.title + '_id'
const getReverseIdName = function ({ def, parentDef } = {}) {
  return getSubDefProp(def, 'reverse_id') || `${parentDef.title}_id`;
};


module.exports = {
  getTypeName,
  getOperationNameFromModel,
  getOperationNameFromAttr,
  getReverseIdName,
};