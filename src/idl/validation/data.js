'use strict';

const { recurseMap } = require('../../utilities');
const { EngineError } = require('../../error');

// Validate JSON schema `$data` properties
const validateData = function ({ idl }) {
  return recurseMap({
    value: idl,
    mapperFunc: validateDataMapper,
    onlyLeaves: false,
  });
};

const validateDataMapper = function (prop) {
  if (typeof prop !== 'object') { return prop; }

  // Find all $data properties
  const dataProps = Object.entries(prop)
    .filter(([, { $data }]) => $data);

  for (const [key, value] of dataProps) {
    validateDataFormat({ value });
    // At the moment, main IDL validation does not support `$data`,
    // so we remove them
    delete prop[key];
  }

  return prop;
};

// Validates that $data is { $data: '...' }
const validateDataFormat = function ({ value }) {
  if (typeof value.$data !== 'string') {
    const message = `'$data' must be a string: ${JSON.stringify(value)}`;
    throw new EngineError(message, { reason: 'IDL_VALIDATION' });
  }

  if (Object.keys(value).length > 1) {
    const val = JSON.stringify(value);
    const message = `'$data' must be the only property when specified: ${val}`;
    throw new EngineError(message, { reason: 'IDL_VALIDATION' });
  }
};

module.exports = {
  validateData,
};
