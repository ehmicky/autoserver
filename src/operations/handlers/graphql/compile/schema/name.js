'use strict';

const { camelize, capitalize } = require('underscore.string');
const { plural, singular } = require('pluralize');

// Returns type name, titleized with command prepended, in singular form,
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
const getModelFieldName = function ({ modelName, command }) {
  const modelNameA = command.multiple ? plural(modelName) : singular(modelName);
  return camelize(`${command.type} ${modelNameA}`);
};

// Returns recursive attributes field names
const getAttrFieldName = function ({ modelName, command }) {
  return camelize(`${command.type} ${modelName}`);
};

module.exports = {
  getTypeName,
  getModelFieldName,
  getAttrFieldName,
};
