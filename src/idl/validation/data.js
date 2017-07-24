'use strict';

const { fullRecurseMap, mapValues, omitBy } = require('../../utilities');
const { EngineError } = require('../../error');

// Validate JSON schema `$data` properties
const validateData = function ({ idl }) {
  return fullRecurseMap(idl, validateDataMapper);
};

const validateDataMapper = function (obj) {
  if (!obj || obj.constructor !== Object) { return obj; }

  const validatedObj = mapValues(obj, child => {
    if (!child.$data) { return child; }
    return validateDataFormat(child);
  });

  // At the moment, main IDL validation does not support `$data`,
  // so we remove them
  const objWithoutData = omitBy(validatedObj, ({ $data }) => $data);

  return objWithoutData;
};

// Validates that $data is { $data: '...' }
const validateDataFormat = function (obj) {
  if (typeof obj.$data !== 'string') {
    const message = `'$data' must be a string: ${obj.$data}`;
    throw new EngineError(message, { reason: 'IDL_VALIDATION' });
  }

  if (Object.keys(obj).length > 1) {
    const val = JSON.stringify(obj);
    const message = `'$data' must be the only property when specified: '${val}'`;
    throw new EngineError(message, { reason: 'IDL_VALIDATION' });
  }

  return obj;
};

module.exports = {
  validateData,
};
