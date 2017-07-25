'use strict';

const { getYaml, omitBy, fullRecurseMap } = require('../../utilities');
const { validate } = require('../../validation');

const IDL_SCHEMA_PATH = './src/idl/validation/idl_schema.yml';

const validateIdlSyntax = async function (idl) {
  const schema = await getYaml({ path: IDL_SCHEMA_PATH });
  const data = getIdl(idl);
  validate({
    schema,
    data,
    reportInfo: { type: 'idl', dataVar: 'config' },
  });

  return idl;
};

// At the moment, the IDL needs to be modified for proper JSON schema validation
// TODO: remove this
const getIdl = function (idl) {
  return modifiers.reduce((newIdl, modifier) => modifier(newIdl), idl);
};

// Adds some temporary property on IDL, to help validation
const addProps = function (idl) {
  const modelNames = Object.keys(idl.models || {});
  const hasValidation = idl.validation && idl.validation.constructor === Object;
  const customValidationNames = hasValidation
    ? Object.keys(idl.validation)
    : [];

  return Object.assign({}, idl, { modelNames, customValidationNames });
};

// At the moment, main IDL validation does not support `$data`,
// so we remove them
const removeData = function (idl) {
  return fullRecurseMap(idl, obj => {
    if (!obj || obj.constructor !== Object) { return obj; }
    return omitBy(obj, ({ $data }) => $data);
  });
};

const modifiers = [
  addProps,
  removeData,
];

module.exports = {
  validateIdlSyntax,
};
