'use strict';

const { omitBy, fullRecurseMap } = require('../../../utilities');
const { loadFile } = require('../../../formats');
const { compile, validate } = require('../../../json_validation');

const CONFIG_JSON_SCHEMA_PATH = `${__dirname}/config_schema.yml`;

// General config syntax validation
const validateConfigSyntax = async function ({ config }) {
  const jsonSchema = await loadFile({ path: CONFIG_JSON_SCHEMA_PATH });
  const compiledJsonSchema = compile({ jsonSchema });

  const data = getConfig(config);

  validate({
    compiledJsonSchema,
    data,
    dataVar: 'config',
    reason: 'CONF_VALIDATION',
    message: 'Error in configuration',
  });
};

// At the moment, the config needs to be modified for proper JSON schema
// validation
// TODO: remove this
const getConfig = function (config) {
  return modifiers.reduce((configA, modifier) => modifier(configA), config);
};

// Adds some temporary property on the config, to help validation
const addProps = function (config) {
  const collTypes = getCollTypes(config);
  const customValidationNames = getCustomValidationNames(config);

  return { ...config, collTypes, customValidationNames };
};

const getCollTypes = function ({ collections }) {
  const simpleCollTypes = Object.keys(collections || {});
  const arrayCollTypes = simpleCollTypes.map(name => `${name}[]`);

  return [...simpleCollTypes, ...arrayCollTypes];
};

const getCustomValidationNames = function ({ validation }) {
  const hasValidation = validation && validation.constructor === Object;
  if (!hasValidation) { return []; }

  return Object.keys(validation);
};

// At the moment, main config validation does not support `$data`,
// so we remove them
const removeData = function (config) {
  return fullRecurseMap(config, removeDatum);
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
  validateConfigSyntax,
};
