'use strict';

const { throwError } = require('../../error');
const { STATUS_LEVEL_MAP } = require('../../events');

// Retrieve response's status
const getStatus = function ({ error, protocolHandler }) {
  const protocolStatus = getProtocolStatus({ error, protocolHandler });
  const status = getGenericStatus({ protocolStatus, protocolHandler });
  const level = getLevel({ status });

  validateStatuses({ protocolStatus, status });

  return { protocolStatus, status, level };
};

// Protocol-specific status, e.g. HTTP status code
const getProtocolStatus = function ({
  error,
  protocolHandler,
  protocolHandler: { failureProtocolStatus },
}) {
  const protocolStatus = protocolHandler.getProtocolStatus({ error });
  return protocolStatus || failureProtocolStatus;
};

// Protocol-agnostic status
const getGenericStatus = function ({ protocolStatus, protocolHandler }) {
  const status = protocolHandler.getStatus({ protocolStatus });
  return status || DEFAULT_STATUS;
};

const DEFAULT_STATUS = 'SERVER_ERROR';

// Event level
const getLevel = function ({ status }) {
  return STATUS_LEVEL_MAP[status] || DEFAULT_LEVEL;
};

const DEFAULT_LEVEL = 'error';

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
