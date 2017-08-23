'use strict';

const { throwError } = require('../../error');
const { addReqInfo } = require('../../events');

// Retrieve response's status
const getStatus = function (input) {
  const statuses = getStatuses({ input });
  const inputA = addReqInfo(input, statuses);

  return { ...inputA, ...statuses };
};

const getStatuses = function ({ input: { protocolHandler, error } }) {
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
