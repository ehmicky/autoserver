'use strict';

const { throwError, rethrowError, normalizeError } = require('../../error');
const { addLogInfo } = require('../../logging');

// Retrieve response's status
const getStatus = async function (nextFunc, input) {
  try {
    const response = await nextFunc(input);
    const responseA = addStatuses({ input, response });
    return responseA;
  } catch (error) {
    const errorA = normalizeError({ error });
    const errorB = addStatuses({ input, error: errorA });
    rethrowError(errorB);
  }
};

const addStatuses = function ({ input, error, response }) {
  const statuses = getStatuses({ input, error });
  const obj = error || response;
  const objA = addLogInfo(obj, statuses);
  return { ...objA, ...statuses };
};

const getStatuses = function ({
  input: { protocolHandler },
  error,
}) {
  // Protocol-specific status, e.g. HTTP status code
  const protocolStatus = protocolHandler.getProtocolStatus({ error });
  // Protocol-agnostic status
  const status = protocolHandler.getStatus({ protocolStatus });

  validateStatuses({ protocolStatus, status });

  return { protocolStatus, status };
};

const validateStatuses = function ({ protocolStatus, status }) {
  if (protocolStatus === undefined) {
    const message = '\'protocolStatus\' must be defined';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (status === undefined) {
    const message = '\'status\' must be defined';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

module.exports = {
  getStatus,
};
