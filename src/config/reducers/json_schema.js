'use strict';

const { pickBy, mapValues, omit } = require('../../utilities');
const { addGenErrorHandler } = require('../../error');
const { compile } = require('../../validation');

// Compile JSON schema defined in the config
// Returns compiled JSON schema of:
//   { coll: { type: 'object', required: [...], properties: { ... } }
const compileJsonSchema = function ({
  config,
  config: { collections, shortcuts },
}) {
  const validateMap = mapValues(
    collections,
    ({ attributes }) => compileCollection({ attributes, config }),
  );

  return { shortcuts: { ...shortcuts, validateMap } };
};

const eCompileJsonSchema = addGenErrorHandler(compileJsonSchema, {
  message: 'Invalid JSON schema in \'validate\' property',
  reason: 'CONF_VALIDATION',
});

const compileCollection = function ({ attributes, config }) {
  return mappers
    .reduce((jsonSchema, mapper) => mapper({ config, jsonSchema }), attributes);
};

// From `attr.validate` to `{ type: 'object', properties }`
const attrsToJsonSchema = function ({ jsonSchema }) {
  const properties = mapValues(jsonSchema, ({ validate }) => validate);

  return { type: 'object', properties };
};

// Fix `required` attribute according to the current command
// JSON schema `require` attribute is a collection-level array,
// not an attribute-level boolean
const addJsonSchemaRequire = function ({
  jsonSchema,
  jsonSchema: { properties },
}) {
  const requiredAttrs = pickBy(properties, ({ required }) => required);
  const requiredA = Object.keys(requiredAttrs);
  // `id` requiredness is checked by other validators, so we skip it here
  const requiredB = requiredA.filter(attrName => attrName !== 'id');
  return { ...jsonSchema, required: requiredB };
};

// JSON schema `dependencies` attribute is collection-level, not attribute-level
const addJsonSchemaDeps = function ({
  jsonSchema,
  jsonSchema: { properties },
}) {
  const dependenciesA = mapValues(
    properties,
    ({ dependencies }) => dependencies,
  );
  const dependenciesB = pickBy(dependenciesA, dep => dep !== undefined);
  return { ...jsonSchema, dependencies: dependenciesB };
};

// Remove syntax that is not JSON schema
const removeAltSyntax = function ({ jsonSchema, jsonSchema: { properties } }) {
  const propertiesA = mapValues(
    properties,
    attr => omit(attr, NON_JSON_SCHEMA),
  );
  return { ...jsonSchema, properties: propertiesA };
};

const NON_JSON_SCHEMA = [
  'required',
  'dependencies',
];

const mappers = [
  attrsToJsonSchema,
  addJsonSchemaRequire,
  addJsonSchemaDeps,
  removeAltSyntax,
  compile,
];

module.exports = {
  compileJsonSchema: eCompileJsonSchema,
};
