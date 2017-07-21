'use strict';

const { EngineError, normalizeError } = require('../../error');

// Retrieve response's status
const getStatus = async function (input) {
  try {
    const response = await this.next(input);

    const { protocolStatus, status } = getStatuses({ input });
    Object.assign(response, { protocolStatus, status });

    return response;
  } catch (error) {
    const errorObj = normalizeError({ error });

    const { protocolStatus, status } = getStatuses({ input, error: errorObj });
    Object.assign(errorObj, { protocolStatus, status });

    throw errorObj;
  }
};

const getStatuses = function ({
  input: { log, protocolHandler, protocolStatus: currentProtocolStatus },
  error,
}) {
  // Protocol-specific status, e.g. HTTP status code
  const protocolStatus = currentProtocolStatus ||
    protocolHandler.getProtocolStatus({ error });
  // Protocol-agnostic status
  const status = protocolStatus &&
    protocolHandler.getStatus({ protocolStatus });

  validateStatuses({ protocolStatus, status });

  // Used to indicate that `status` and `protocolStatus` should be kept
  // by the `error_status` middleware
  if (error !== undefined) {
    error.isStatusError = true;
  }

  log.add({ protocolStatus, status });
  return { protocolStatus, status };
};

const validateStatuses = function ({ protocolStatus, status }) {
  if (protocolStatus === undefined) {
    const message = '\'protocolStatus\' must be defined';
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (status === undefined) {
    const message = '\'status\' must be defined';
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

module.exports = {
  getStatus,
};
