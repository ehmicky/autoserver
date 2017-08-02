'use strict';

const { pickBy, mapValues, omit } = require('../../../../utilities');
const { getValidator } = require('../../../../validation');

const mapProp = prop => prop.validate;

const mapProps = function (properties) {
  return mappers.reduce((schema, mapper) => mapper(schema), properties);
};

const propsToJsonSchema = function (properties) {
  return { type: 'object', properties };
};

// Fix `required` attribute according to the current command.name
// JSON schema `require` attribute is a model-level array,
// not an attribute-level boolean
const addJsonSchemaRequire = function (schema) {
  const requiredProps = pickBy(schema.properties, attr => attr.required);
  const required = Object.keys(requiredProps);
  // `id` requiredness is checked by other validators, so we skip it here
  const requiredA = required.filter(attrName => attrName !== 'id');
  return { ...schema, required: requiredA };
};

// JSON schema `dependencies` attribute is model-level, not attribute-level
const addJsonSchemaDeps = function (schema) {
  const dependencies = mapValues(schema.properties, prop => prop.dependencies);
  const dependenciesA = pickBy(dependencies, dep => dep !== undefined);
  return { ...schema, dependencies: dependenciesA };
};

// Remove syntax that is not JSON schema
const removeAltSyntax = function (schema) {
  const propertiesA = mapValues(
    schema.properties,
    prop => omit(prop, nonJsonSchema),
  );
  return { ...schema, properties: propertiesA };
};

const nonJsonSchema = [
  'required',
  'dependencies',
];

// Validates that idl.models.MODEL are valid JSON schema by compiling them
// with AJV
const validateJsonSchema = function (schema) {
  getValidator({ schema });
  return schema;
};

const mappers = [
  propsToJsonSchema,
  addJsonSchemaRequire,
  addJsonSchemaDeps,
  removeAltSyntax,
  validateJsonSchema,
];

// Retrieves map of models's JSON schema validations
// E.g. { model: { type: 'object', required: [...], properties: { ... } }
const validateMap = { mapProp, mapProps };

module.exports = {
  validateMap,
};
