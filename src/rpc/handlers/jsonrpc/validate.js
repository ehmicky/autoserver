'use strict';

const { throwError } = require('../../../error');

const validatePayload = function ({ payload }) {
  validateBatch({ payload });
  validateJson({ payload });

  const { jsonrpc, method, id, params } = payload;

  validateVersion({ jsonrpc });
  validateMethod({ method });
  validateId({ id });
  validateParams({ params });
  validateArrayParams({ params });
};

const validateBatch = function ({ payload }) {
  if (!Array.isArray(payload)) { return; }

  const message = 'Invalid JSON-RPC payload: batch requests are not supported, so the payload must not be an array';
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const validateJson = function ({ payload }) {
  if (payload && payload.constructor === Object) { return; }

  const message = 'Invalid JSON-RPC payload: it must be an object';
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const validateVersion = function ({ jsonrpc }) {
  if (jsonrpc === undefined || typeof jsonrpc === 'string') { return; }

  const message = 'Invalid JSON-RPC payload: \'jsonrpc\' must be a string or undefined';
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const validateMethod = function ({ method }) {
  if (typeof method === 'string') { return; }

  const message = 'Invalid JSON-RPC payload: \'method\' must be a string';
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const validateId = function ({ id }) {
  if (id == null || typeof id === 'string' || Number.isInteger(id)) { return; }

  const message = 'Invalid JSON-RPC payload: \'id\' must be a string, an integer, null or undefined';
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const validateParams = function ({ params }) {
  const isValidType = params === undefined ||
    params.constructor === Object ||
    Array.isArray(params);
  if (isValidType) { return; }

  const message = 'Invalid JSON-RPC payload: \'params\' type is invalid';
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const validateArrayParams = function ({ params }) {
  if (!Array.isArray(params)) { return; }

  const hasRightFormat = params.length <= 1 &&
    params.every(param => param && param.constructor === Object);
  if (hasRightFormat) { return; }

  const message = 'Invalid JSON-RPC payload: \'params\' must only contain one object or none';
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  validatePayload,
};
