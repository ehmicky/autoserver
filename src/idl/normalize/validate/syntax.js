'use strict';

const { getYaml, omitBy, fullRecurseMap } = require('../../../utilities');
const { compile, validate } = require('../../../json_validation');

const IDL_JSON_SCHEMA_PATH = `${__dirname}/idl_json_schema.yml`;

// General IDL syntax validation
const validateIdlSyntax = async function ({ idl }) {
  const jsonSchema = await getYaml({ path: IDL_JSON_SCHEMA_PATH });
  const compiledJsonSchema = compile({ jsonSchema });
  const data = getIdl(idl);
  validate({
    compiledJsonSchema,
    data,
    dataVar: 'idl',
    reason: 'IDL_VALIDATION',
    message: 'Error in IDL file',
  });

  return idl;
};

// At the moment, the IDL needs to be modified for proper JSON schema validation
// TODO: remove this
const getIdl = function (idl) {
  return modifiers.reduce((idlA, modifier) => modifier(idlA), idl);
};

// Adds some temporary property on IDL, to help validation
const addProps = function (idl) {
  const modelTypes = getModelTypes(idl);
  const customValidationNames = getCustomValidationNames(idl);

  return { ...idl, modelTypes, customValidationNames };
};

const getModelTypes = function (idl) {
  const simpleModelTypes = Object.keys(idl.models || {});
  const arrayModelTypes = simpleModelTypes.map(name => `${name}[]`);

  return [...simpleModelTypes, ...arrayModelTypes];
};

const getCustomValidationNames = function (idl) {
  const hasValidation = idl.validation && idl.validation.constructor === Object;
  if (!hasValidation) { return []; }

  return Object.keys(idl.validation);
};

// At the moment, main IDL validation does not support `$data`,
// so we remove them
const removeData = function (idl) {
  return fullRecurseMap(idl, obj => removeDatum(obj));
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
  validateIdlSyntax,
};
