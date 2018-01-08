'use strict';

const { mapValues } = require('../utilities');
const { addGenErrorHandler } = require('../errors');

const { VALIDATORS } = require('./validate');

// Wrap all adapters functions with an error handler
const addErrorHandlers = function (adapter) {
  const adapterA = mapValues(adapter, addErrorHandler);

  const input = mapValues(adapter.input || {}, addErrorHandler);
  const adapterB = { ...adapterA, input };

  return adapterB;
};

const addErrorHandler = function (value, name) {
  if (typeof value !== 'function') { return value; }

  const valueA = addGenErrorHandler(value, { reason: getReason });

  const validator = VALIDATORS[name];
  if (validator === undefined) { return valueA; }

  const valueB = wrapFunction.bind(null, { func: valueA, validator, name });

  return valueB;
};

const wrapFunction = function ({ func, validator, name }, ...args) {
  const returnValue = func(...args);

  validator(returnValue, name, ...args);

  return returnValue;
};

// Default reason is PROTOCOL
const getReason = function (input, { reason }) {
  if (reason && reason !== 'UNKNOWN') { return reason; }

  return 'PROTOCOL';
};

module.exports = {
  addErrorHandlers,
};
