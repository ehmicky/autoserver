'use strict';

const { EngineError } = require('./engine_error');

// External dependencies might throw errors that are not instances of
// EngineError, so we want to fix those.
const normalizeError = function ({ error, reason = 'UNKNOWN' }) {
  if (error instanceof Error) { return error; }

  const message = typeof error === 'string' ? error : '';
  return new EngineError(message, { reason });
};

module.exports = {
  normalizeError,
};
