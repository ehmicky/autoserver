'use strict';

const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');

// Returns type name, titleized with action prepended, in singular form,
// e.g. `FindPet`, for schema type name
const getTypeName = function ({
  def: { kind, typeName },
  opts: { inputObjectType = '' },
}) {
  const nestedPostfix = kind === 'attribute' ? 'nested' : '';
  const nameA = `${typeName} ${inputObjectType} ${nestedPostfix}`;
  const nameB = capitalize(nameA);
  return camelize(nameB);
};

// Returns model field name, camelized, in plural form,
// e.g. `findPets` or `deletePets`
const getModelFieldName = function ({ modelName, action }) {
  const modelNameA = action.multiple ? plural(modelName) : singular(modelName);
  return camelize(`${action.type} ${modelNameA}`);
};

// Returns recursive attributes field names
const getAttrFieldName = function ({ modelName, action }) {
  return camelize(`${action.type} ${modelName}`);
};

module.exports = {
  getTypeName,
  getModelFieldName,
  getAttrFieldName,
};
