'use strict';


const { merge } = require('lodash');
const yaml = require('js-yaml');

const { buildValidator, validate, memoize, fs: { readFileAsync } } = require('../../utilities');
const { validateCircularRefs } = require('./circular_refs');
const IDL_SCHEMA_PATH = './src/idl/validation/idl_schema.yml';


// Validate IDL definition against a JSON schema
const validateIdl = async function (idl) {
  const schema = await getSchema();
  const idlCopy = getIdlCopy(idl);
  buildValidator();
  validateCircularRefs({ value: idl });
  validate({ schema, data: idlCopy, reportInfo: { type: 'idl', dataVar: 'config' } });
};

// Adds some temporary property on IDL, to help validation
const getIdlCopy = function (idl) {
  const modelNames = Object.keys(idl.models);
  const customValidationNames = idl.validation && idl.validation.constructor === Object ? Object.keys(idl.validation) : [];
  return merge({}, idl, { modelNames, customValidationNames });
};

// Retrieve IDL schema
const getSchema = memoize(async function () {
  const schemaContent = await readFileAsync(IDL_SCHEMA_PATH);
  const schema = yaml.load(schemaContent, { schema: yaml.CORE_SCHEMA, json: true });
  return schema;
});


module.exports = {
  validateIdl,
};
