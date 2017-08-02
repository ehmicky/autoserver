'use strict';

const { pickBy, mapValues, omit } = require('../../../utilities');

// Retrieves JSON schema to validate against
const getDataValidationSchema = function ({ idl, modelName, command }) {
  const model = idl.models[modelName];
  const validate = mapValues(model.properties, prop => prop.validate);
  const schema = { type: 'object', properties: validate };
  const schemaA = addJsonSchemaRequire({ schema });
  const schemaB = addJsonSchemaDeps({ schema: schemaA });
  const schemaC = removeAltSyntax({ schema: schemaB });

  const schemaD = removeRequire({ schema: schemaC, command });
  return schemaD;
};

// Nothing is required for read|delete, except maybe `id` (previously validated)
const removeRequire = function ({ schema, command }) {
  if (!optionalInputCommands.includes(command.name)) { return schema; }

  return omit(schema, 'required');
};

const optionalInputCommands = [
  'readOne',
  'readMany',
  'deleteOne',
  'deleteMany',
];

// Fix `required` attribute according to the current command.name
// JSON schema `require` attribute is a model-level array,
// not an attribute-level boolean
const addJsonSchemaRequire = function ({ schema, schema: { properties } }) {
  const requiredProps = pickBy(properties, attr => attr.required);
  const required = Object.keys(requiredProps);
  // `id` requiredness is checked by other validators, so we skip it here
  const requiredA = required.filter(attrName => attrName !== 'id');
  return { ...schema, required: requiredA };
};

// JSON schema `dependencies` attribute is model-level, not attribute-level
const addJsonSchemaDeps = function ({ schema, schema: { properties } }) {
  const dependencies = mapValues(properties, prop => prop.dependencies);
  const dependenciesA = pickBy(dependencies, dep => dep !== undefined);
  return { ...schema, dependencies: dependenciesA };
};

// Remove syntax that is not JSON schema
const removeAltSyntax = function ({ schema, schema: { properties } }) {
  const propertiesA = mapValues(properties, prop => omit(prop, nonJsonSchema));
  return { ...schema, properties: propertiesA };
};

const nonJsonSchema = [
  'required',
  'dependencies',
];

module.exports = {
  getDataValidationSchema,
};
