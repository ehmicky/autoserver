'use strict';

const { throwError, rethrowError, normalizeError } = require('../../error');

// Retrieve response's status
const getStatus = async function (nextFunc, input) {
  try {
    const response = await nextFunc(input);

    const { protocolStatus, status } = getStatuses({ input });
    Object.assign(response, { protocolStatus, status });

    return response;
  } catch (error) {
    const errorObj = normalizeError({ error });

    const statuses = getStatuses({ input, error: errorObj });
    input.log.add(statuses);
    const newError = Object.assign({}, errorObj, statuses);

    rethrowError(newError);
  }
};

const getStatuses = function ({
  input: { protocolHandler, protocolStatus: currentProtocolStatus },
  error,
}) {
  // Protocol-specific status, e.g. HTTP status code
  const protocolStatus = currentProtocolStatus ||
    protocolHandler.getProtocolStatus({ error });
  // Protocol-agnostic status
  const status = protocolStatus &&
    protocolHandler.getStatus({ protocolStatus });

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
