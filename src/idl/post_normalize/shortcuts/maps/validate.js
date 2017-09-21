'use strict';

const { pickBy, mapValues, omit } = require('../../../../utilities');

const mapAttr = attr => attr.validate;

const mapAttrs = function (attrs, { idl }) {
  return mappers.reduce((schema, mapper) => mapper(schema, { idl }), attrs);
};

const attrsToJsonSchema = function (attributes) {
  return { type: 'object', properties: attributes };
};

// Fix `required` attribute according to the current command
// JSON schema `require` attribute is a model-level array,
// not an attribute-level boolean
const addJsonSchemaRequire = function (schema) {
  const requiredAttrs = pickBy(schema.properties, attr => attr.required);
  const required = Object.keys(requiredAttrs);
  // `id` requiredness is checked by other validators, so we skip it here
  const requiredA = required.filter(attrName => attrName !== 'id');
  return { ...schema, required: requiredA };
};

// JSON schema `dependencies` attribute is model-level, not attribute-level
const addJsonSchemaDeps = function (schema) {
  const dependencies = mapValues(schema.properties, attr => attr.dependencies);
  const dependenciesA = pickBy(dependencies, dep => dep !== undefined);
  return { ...schema, dependencies: dependenciesA };
};

// Remove syntax that is not JSON schema
const removeAltSyntax = function (schema) {
  const properties = mapValues(
    schema.properties,
    attr => omit(attr, nonJsonSchema),
  );
  return { ...schema, properties };
};

const nonJsonSchema = [
  'required',
  'dependencies',
];

const mappers = [
  attrsToJsonSchema,
  addJsonSchemaRequire,
  addJsonSchemaDeps,
  removeAltSyntax,
];

// Retrieves map of models's JSON schema validations
// E.g. { model: { type: 'object', required: [...], properties: { ... } }
const validateMap = { mapAttr, mapAttrs };

module.exports = {
  validateMap,
};
