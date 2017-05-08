'use strict';


const yaml = require('js-yaml');

const { getValidator, buildValidator, validate, memoize, fs: { readFileAsync } } = require('../../utilities');
const { validateCircularRefs } = require('./circular_refs');
const { validateData } = require('./data');
const IDL_SCHEMA_PATH = './src/idl/validation/idl_schema.yml';


// Validate IDL definition against a JSON schema
const validateIdl = async function (idl) {
  buildValidator();
  validateCircularRefs({ value: idl });

  const schema = await getSchema();
  idl = getIdlCopy({ idl });
  idl = validateData({ idl });
  validate({ schema, data: idl, reportInfo: { type: 'idl', dataVar: 'config' } });

  jsonSchemaValidate({ idl });
};

// Adds some temporary property on IDL, to help validation
const getIdlCopy = function ({ idl }) {
  const modelNames = Object.keys(idl.models || {});
  const customValidationNames = idl.validation && idl.validation.constructor === Object ? Object.keys(idl.validation) : [];
  return Object.assign({}, idl, { modelNames, customValidationNames });
};

// Retrieve IDL schema
const getSchema = memoize(async function () {
  const schemaContent = await readFileAsync(IDL_SCHEMA_PATH);
  const schema = yaml.load(schemaContent, { schema: yaml.CORE_SCHEMA, json: true });
  return schema;
});

// Validates that idl.models.MODEL are valid JSON schema by compiling them with AJV
const jsonSchemaValidate = function ({ idl: { models } }) {
  for (const model of Object.values(models)) {
    getValidator({ schema: model });
  }
};


module.exports = {
  validateIdl,
};
