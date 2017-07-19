'use strict';

const { readFile } = require('fs');
const { promisify } = require('util');

const yaml = require('js-yaml');

const { memoize } = require('../../utilities');
const { getValidator, validate } = require('../../validation');

const { validateCircularRefs } = require('./circular_refs');
const { validateData } = require('./data');
const { validateIdlJsl } = require('./jsl');

const IDL_SCHEMA_PATH = './src/idl/validation/idl_schema.yml';

// Validate IDL definition against a JSON schema
const validateIdl = async function ({ idl: oIdl }) {
  validateCircularRefs({ value: oIdl });

  const schema = await getSchema();
  const copiedIdl = getIdlCopy({ idl: oIdl });
  const idl = validateData({ idl: copiedIdl });
  validate({
    schema,
    data: idl,
    reportInfo: { type: 'idl', dataVar: 'config' },
  });

  jsonSchemaValidate({ idl });
  validateIdlJsl({ idl });

  return idl;
};

// Adds some temporary property on IDL, to help validation
const getIdlCopy = function ({ idl }) {
  const modelNames = Object.keys(idl.models || {});
  const customValidationNames = idl.validation &&
    idl.validation.constructor === Object
    ? Object.keys(idl.validation)
    : [];
  return Object.assign({}, idl, { modelNames, customValidationNames });
};

// Retrieve IDL schema
const getSchema = memoize(async () => {
  const schemaContent = await promisify(readFile)(IDL_SCHEMA_PATH, {
    encoding: 'utf-8',
  });
  const schema = yaml.load(schemaContent, {
    schema: yaml.CORE_SCHEMA,
    json: true,
  });
  return schema;
});

// Validates that idl.models.MODEL are valid JSON schema by compiling them
// with AJV
const jsonSchemaValidate = function ({ idl: { models } }) {
  for (const model of Object.values(models)) {
    getValidator({ schema: model });
  }
};

module.exports = {
  validateIdl,
};
