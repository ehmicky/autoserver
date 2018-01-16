'use strict';

const { mapValues } = require('../../../utilities');
const { throwError } = require('../../../errors');

// Use query variables, request payload and URL /ID to retrieve `args`
const getArgs = function ({ method, payload, queryvars, id }) {
  const args = mapValues(queryvars, addDefaultTrue);
  const argsA = addData({ args, payload });
  const argsB = addId({ method, args: argsA, id });
  return argsB;
};

// Omitting a query variable's value defaults to `true`
// Except for arguments which can be an empty strings, like pagination cursors
const addDefaultTrue = function (value, name) {
  if (value !== '') { return value; }

  if (NO_DEFAULT_NAMES.includes(name)) { return value; }

  return true;
};

const NO_DEFAULT_NAMES = ['before', 'after'];

// Use request payload for `args.data`
const addData = function ({ args, payload }) {
  if (payload === undefined) { return args; }

  validatePayload({ payload });

  return { ...args, data: payload };
};

const validatePayload = function ({ payload }) {
  if (payload && typeof payload === 'object') { return; }

  const message = 'Invalid request format: payload must be an object or an array';
  throwError(message, { reason: 'PAYLOAD_PARSE' });
};

// Use ID in URL /rest/COLLECTION/ID for `args.id`
const addId = function ({ method, args, args: { data }, id }) {
  if (id === undefined) { return args; }

  // If it looks like a number, it will have been transtyped by query variables
  // middleware
  const idA = String(id);

  // If the method does not use `args.id`, it is still checked against
  // `args.data`
  if (NO_ID_METHODS.includes(method)) {
    validateId({ data, id: idA });
    return args;
  }

  return { ...args, id: idA };
};

const NO_ID_METHODS = ['POST', 'PUT'];

const validateId = function ({ data, id }) {
  if (Array.isArray(data)) {
    const message = 'Payload must be a single object';
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (data.id !== id) {
    const message = `The model's 'id' is '${data.id}' in the request payload but is '${id}' in the URL`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }
};

module.exports = {
  getArgs,
};
