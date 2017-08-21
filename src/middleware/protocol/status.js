'use strict';

const { throwError, rethrowError, normalizeError } = require('../../error');
const { addReqInfo } = require('../../events');

// Retrieve response's status
const getStatus = async function (nextFunc, input) {
  try {
    const inputA = await nextFunc(input);
    const statuses = addStatuses({ input: inputA });
    return { ...inputA, response: { ...inputA.response, ...statuses } };
  } catch (error) {
    const errorA = normalizeError({ error });
    const statuses = addStatuses({ input, error: errorA });
    const errorB = { ...errorA, ...statuses };
    rethrowError(errorB);
  }
};

const addStatuses = function ({ input, error }) {
  const statuses = getStatuses({ input, error });
  addReqInfo(input, statuses);
  return statuses;
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
