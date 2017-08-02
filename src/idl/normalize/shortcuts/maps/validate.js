'use strict';

const { pickBy, mapValues, omit } = require('../../../../utilities');
const { getValidator } = require('../../../../validation');

const mapAttr = attr => attr.validate;

const mapAttrs = function (attrs) {
  return mappers.reduce((schema, mapper) => mapper(schema), attrs);
};

const attrsToJsonSchema = function (attributes) {
  return { type: 'object', attributes };
};

// Fix `required` attribute according to the current command.name
// JSON schema `require` attribute is a model-level array,
// not an attribute-level boolean
const addJsonSchemaRequire = function (schema) {
  const requiredAttrs = pickBy(schema.attributes, attr => attr.required);
  const required = Object.keys(requiredAttrs);
  // `id` requiredness is checked by other validators, so we skip it here
  const requiredA = required.filter(attrName => attrName !== 'id');
  return { ...schema, required: requiredA };
};

// JSON schema `dependencies` attribute is model-level, not attribute-level
const addJsonSchemaDeps = function (schema) {
  const dependencies = mapValues(schema.attributes, attr => attr.dependencies);
  const dependenciesA = pickBy(dependencies, dep => dep !== undefined);
  return { ...schema, dependencies: dependenciesA };
};

// Remove syntax that is not JSON schema
const removeAltSyntax = function (schema) {
  const attributes = mapValues(
    schema.attributes,
    attr => omit(attr, nonJsonSchema),
  );
  return { ...schema, attributes };
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
  attrsToJsonSchema,
  addJsonSchemaRequire,
  addJsonSchemaDeps,
  removeAltSyntax,
  validateJsonSchema,
];

// Retrieves map of models's JSON schema validations
// E.g. { model: { type: 'object', required: [...], attributes: { ... } }
const validateMap = { mapAttr, mapAttrs };

module.exports = {
  validateMap,
};
