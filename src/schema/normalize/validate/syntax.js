'use strict';

const {
  loadYaml,
  omitBy,
  fullRecurseMap,
  pReadFile,
} = require('../../../utilities');
const { compile, validate } = require('../../../json_validation');

const SCHEMA_JSON_SCHEMA_PATH = `${__dirname}/schema_json_schema.yml`;

// General schema syntax validation
const validateSchemaSyntax = async function ({ schema }) {
  const path = SCHEMA_JSON_SCHEMA_PATH;
  const jsonSchema = await pReadFile(path, { encoding: 'utf-8' });
  const jsonSchemaA = await loadYaml({ path, content: jsonSchema });
  const compiledJsonSchema = compile({ jsonSchema: jsonSchemaA });

  const data = getSchema(schema);

  validate({
    compiledJsonSchema,
    data,
    dataVar: 'schema',
    reason: 'SCHEMA_VALIDATION',
    message: 'Error in schema',
  });

  return schema;
};

// At the moment, the schema needs to be modified for proper JSON schema
// validation
// TODO: remove this
const getSchema = function (schema) {
  return modifiers.reduce((schemaA, modifier) => modifier(schemaA), schema);
};

// Adds some temporary property on the schema, to help validation
const addProps = function (schema) {
  const modelTypes = getModelTypes(schema);
  const customValidationNames = getCustomValidationNames(schema);

  return { ...schema, modelTypes, customValidationNames };
};

const getModelTypes = function (schema) {
  const simpleModelTypes = Object.keys(schema.models || {});
  const arrayModelTypes = simpleModelTypes.map(name => `${name}[]`);

  return [...simpleModelTypes, ...arrayModelTypes];
};

const getCustomValidationNames = function (schema) {
  const hasValidation = schema.validation &&
    schema.validation.constructor === Object;
  if (!hasValidation) { return []; }

  return Object.keys(schema.validation);
};

// At the moment, main schema validation does not support `$data`,
// so we remove them
const removeData = function (schema) {
  return fullRecurseMap(schema, obj => removeDatum(obj));
};

const removeDatum = function (obj) {
  if (!obj || obj.constructor !== Object) { return obj; }
  return omitBy(obj, prop => prop && prop.$data);
};

const modifiers = [
  addProps,
  removeData,
];

module.exports = {
  validateSchemaSyntax,
};
