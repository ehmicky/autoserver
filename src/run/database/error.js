'use strict';

const { mapValues } = require('../../utilities');
const { addErrorHandler, normalizeError, rethrowError } = require('../../error');

// Wrap all database adapters methods so that they throw proper exceptions
const addAllErrorHandlers = function ({ adapters }) {
  return adapters.map(addHandlers);
};

const addHandlers = function (adapter) {
  return mapValues(adapter, addHandler);
};

const addHandler = function (func, funcName, { type }) {
  if (!Object.keys(errorMessages).includes(funcName)) { return func; }

  return addErrorHandler(func, errorHandler.bind(null, { funcName, type }));
};

const errorHandler = function ({ funcName, type }, error) {
  const message = errorMessages[funcName];
  const messageA = `${message} database '${type}'`;
  const errorA = normalizeError({
    error,
    message: messageA,
    reason: 'DB_ERROR',
  });
  rethrowError(errorA);
};

const errorMessages = {
  connect: 'Could not connect to',
  disconnect: 'Could not disconnect to',
  find: 'Could not query models in',
  create: 'Could not create models in',
  replace: 'Could not modify models in',
  delete: 'Could not delete models in',
};

module.exports = {
  addAllErrorHandlers,
};
