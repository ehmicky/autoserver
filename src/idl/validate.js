'use strict';


const { mapValues, merge, uniqBy } = require('lodash');
const yaml = require('js-yaml');
const fs = require('fs');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, errorDataPath: 'property', jsonPointers: true, full: true, $data: true });
// Add future JSON standard keywords
require('ajv-keywords')(ajv, [ 'if', 'formatMinimum', 'formatMaximum', 'deepRequired', 'deepProperties', ]);

const { EngineStartupError } = require('../error');


// Validate IDL definition against a JSON schema
const validateIdl = function (idl) {
  const validateFunc = getValidateFunc();
  const idlCopy = getIdlCopy(idl);
  const isValid = validateFunc(idlCopy);
  if (!isValid) {
    notifyErrors(validateFunc.errors);
  }
};

// Adds some temporary property on IDL, to help validation
const getIdlCopy = function (idl) {
  const idlCopy = merge({}, idl);
  const models = mapValues(idlCopy.models, model => Object.assign({}, model, { isTopLevel: true }));
  const modelNames = Object.keys(idlCopy.models);
  Object.assign(idlCopy, { models, modelNames });
  return idlCopy;
};

// Retrieve ajv validate function
let cachedValidateFunc;
const getValidateFunc = function () {
  if (cachedValidateFunc) { return cachedValidateFunc; }
  const idlSchemaContent = fs.readFileSync('./src/idl/idl_schema.yml');
  const idlSchema = yaml.load(idlSchemaContent, { schema: yaml.CORE_SCHEMA, json: true });
  const validateFunc = ajv.compile(idlSchema);
  cachedValidateFunc = validateFunc;
  return validateFunc;
};

// Throw error on IDL invalidation
const notifyErrors = function (errors) {
  // Those rules create double error messages, too verbose
  const verboseRules = ['anyOf', 'allOf', 'not', 'oneOf', '$merge', '$patch'];
  errors = errors.filter(error => !verboseRules.includes(error.keyword));
  // When in `anyOf` or similar rules, duplicated messages are created
  const uniqueErrors = uniqBy(errors, 'message');
  const message = '\n' + ajv.errorsText(uniqueErrors, { separator: '\n', dataVar: 'config' });
  throw new EngineStartupError(message, { reason: 'CONFIGURATION_INVALID' });
};


module.exports = {
  validateIdl,
};
