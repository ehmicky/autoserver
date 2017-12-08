'use strict';

const { pickBy, mapValues, omit } = require('../utilities');
const { addGenErrorHandler } = require('../error');
const { compile } = require('../json_validation');

// Compile JSON schema defined in the schema
// Returns compiled JSON schema of:
//   { coll: { type: 'object', required: [...], properties: { ... } }
const compileJsonSchema = function ({
  schema,
  schema: { collections, shortcuts },
}) {
  const validateMap = mapValues(
    collections,
    ({ attributes }) => compileCollection({ attributes, schema }),
  );

  return { ...schema, shortcuts: { ...shortcuts, validateMap } };
};

const eCompileJsonSchema = addGenErrorHandler(compileJsonSchema, {
  message: 'Invalid JSON schema in \'validate\' property',
  reason: 'SCHEMA_VALIDATION',
});

const compileCollection = function ({ attributes, schema }) {
  return mappers
    .reduce((jsonSchema, mapper) => mapper({ schema, jsonSchema }), attributes);
};

const attrsToJsonSchema = function ({ jsonSchema }) {
  const properties = mapValues(jsonSchema, ({ validate }) => validate);

  return { type: 'object', properties };
};

// Fix `required` attribute according to the current command
// JSON schema `require` attribute is a collection-level array,
// not an attribute-level boolean
const addJsonSchemaRequire = function ({ jsonSchema }) {
  const requiredAttrs = pickBy(jsonSchema.properties, attr => attr.required);
  const required = Object.keys(requiredAttrs);
  // `id` requiredness is checked by other validators, so we skip it here
  const requiredA = required.filter(attrName => attrName !== 'id');
  return { ...jsonSchema, required: requiredA };
};

// JSON schema `dependencies` attribute is collection-level, not attribute-level
const addJsonSchemaDeps = function ({ jsonSchema }) {
  const dependencies = mapValues(
    jsonSchema.properties,
    attr => attr.dependencies,
  );
  const dependenciesA = pickBy(dependencies, dep => dep !== undefined);
  return { ...jsonSchema, dependencies: dependenciesA };
};

// Remove syntax that is not JSON schema
const removeAltSyntax = function ({ jsonSchema }) {
  const properties = mapValues(
    jsonSchema.properties,
    attr => omit(attr, NON_JSON_SCHEMA),
  );
  return { ...jsonSchema, properties };
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
