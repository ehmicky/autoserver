'use strict';

const { throwError } = require('../../error');
const { STATUS_LEVEL_MAP } = require('../../events');

// Retrieve response's status
const getStatus = function ({ error, protocolHandler }) {
  const protocolstatus = getProtocolstatus({ error, protocolHandler });
  const status = getGenericStatus({ protocolstatus, protocolHandler });
  const level = getLevel({ status });

  validateStatuses({ protocolstatus, status });

  return { protocolstatus, status, level };
};

// Protocol-specific status, e.g. HTTP status code
const getProtocolstatus = function ({
  error,
  protocolHandler,
  protocolHandler: { failureProtocolstatus },
}) {
  const protocolstatus = protocolHandler.getProtocolstatus({ error });
  return protocolstatus || failureProtocolstatus;
};

// Protocol-agnostic status
const getGenericStatus = function ({ protocolstatus, protocolHandler }) {
  const status = protocolHandler.getStatus({ protocolstatus });
  return status || DEFAULT_STATUS;
};

const DEFAULT_STATUS = 'SERVER_ERROR';

// Event level
const getLevel = function ({ status }) {
  return STATUS_LEVEL_MAP[status] || DEFAULT_LEVEL;
};

const DEFAULT_LEVEL = 'error';

const validateStatuses = function ({ protocolstatus, status }) {
  if (protocolstatus === undefined) {
    const message = '\'protocolstatus\' must be defined';
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
