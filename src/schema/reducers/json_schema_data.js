'use strict';

const { fullRecurseMap } = require('../../utilities');
const { throwError } = require('../../error');

// Validate JSON schema `$data` properties
const validateJsonSchemaData = function ({ schema }) {
  fullRecurseMap(schema, validateDataMapper);

  return schema;
};

const validateDataMapper = function (obj) {
  if (!obj || obj.constructor !== Object) { return; }

  Object.values(obj).forEach(child => {
    if (!child || !child.$data) { return; }

    validateDataFormat(child);
  });
};

// Validates that $data is { $data: '...' }
const validateDataFormat = function (obj) {
  if (typeof obj.$data !== 'string') {
    const message = `'$data' must be a string: ${obj.$data}`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  if (Object.keys(obj).length > 1) {
    const val = JSON.stringify(obj);
    const message = `'$data' must be the only property when specified: '${val}'`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

module.exports = {
  validateJsonSchemaData,
};
