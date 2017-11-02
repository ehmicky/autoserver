'use strict';

const { mapValues } = require('../../utilities');
const {
  addErrorHandler,
  normalizeError,
  rethrowError,
} = require('../../error');

// Wrap all database adapters methods so that they throw proper exceptions
const addAllErrorHandlers = function ({ adapters }) {
  return adapters.map(addHandlers);
};

const addHandlers = function (adapter) {
  return mapValues(adapter, addHandler);
};

const addHandler = function (func, funcName, { name }) {
  if (!ERROR_METHOD_NAMES.includes(funcName)) { return func; }

  return addErrorHandler(func, errorHandler.bind(null, { funcName, name }));
};

const errorHandler = function ({ funcName, name }, error, { command }) {
  const message = ERROR_MESSAGES[funcName] || ERROR_MESSAGES[command];
  const messageA = `${message} database '${name}'`;
  const errorA = normalizeError({
    error,
    message: messageA,
    reason: 'DB_ERROR',
  });
  rethrowError(errorA);
};

const ERROR_METHOD_NAMES = ['query', 'connect', 'disconnect'];

const ERROR_MESSAGES = {
  connect: 'Could not connect to',
  disconnect: 'Could not disconnect to',
  find: 'Could not search for models in',
  create: 'Could not create models in',
  upsert: 'Could not upsert models in',
  delete: 'Could not delete models in',
};

module.exports = {
  addAllErrorHandlers,
};
