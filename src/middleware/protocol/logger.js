'use strict';

const { getReason } = require('../../error');
const { STATUS_LEVEL_MAP } = require('../../logging');

// Main request logging middleware.
// Each request creates exactly one log, whether successful or not,
// unless it crashed very early (i.e. before this middleware), in which case
// it will still be handled by the error logging middleware.
const logger = async function logger (input) {
  const { log } = input;

  try {
    const response = await this.next(input);

    const perf = log.perf.start('protocol.logger', 'middleware');
    await handleLog({ input });
    perf.stop();

    return response;
  } catch (error) {
    const perf = log.perf.start('protocol.logger', 'exception');

    addErrorReason({ error, input });
    await handleLog({ error, input });

    perf.stop();
    throw error;
  }
};

const handleLog = async function ({
  error,
  input: { log, status = 'SERVER_ERROR' },
}) {
  // If input.status is already set, reuse it
  // If an error was thrown, level should always be 'warn' or 'error'
  const errorLevel = status === 'CLIENT_ERROR' ? 'warn' : 'error';
  const defaultLevel = STATUS_LEVEL_MAP[status] || 'error';
  const level = error ? errorLevel : defaultLevel;
  // The logger will build the message and the `requestInfo`
  // We do not do it now, because we want the full protocol layer to end first,
  // do `requestInfo` is full.
  await log[level]('', { type: 'call' });
};

// Add information for `requestInfo.error`
const addErrorReason = function ({ error, input: { log } }) {
  if (!(error instanceof Error)) {
    error = new Error(String(error));
  }

  const errorReason = getReason({ error });
  log.add({ errorReason });
};

module.exports = {
  logger,
};
