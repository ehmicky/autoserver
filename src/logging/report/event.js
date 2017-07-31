'use strict';

const { normalizeError } = require('../../error');
const { pSetTimeout } = require('../../utilities');
const { emitEventAsync } = require('../../events');

// Try emit log event with an increasing delay
const emitLogEvent = async function ({
  apiServer,
  eventName,
  reportedLog,
  delay = defaultDelay,
}) {
  try {
    await emitEventAsync({ apiServer, name: eventName, data: reportedLog });
  } catch (error) {
    if (delay > maxDelay) { return; }
    await pSetTimeout(delay);

    const reportedLogA = addLoggerError({ reportedLog, error });
    const delayA = delay * delayExponent;
    await emitLogEvent({
      apiServer,
      eventName,
      reportedLog: reportedLogA,
      delay: delayA,
    });
  }
};

const defaultDelay = 1000;
const delayExponent = 5;
const maxDelay = 1000 * 60 * 3;

// Keep track of the error the logging utility threw
const addLoggerError = function ({
  reportedLog,
  reportedLog: { loggerErrors = [] },
  error,
  error: { stack = '' },
}) {
  const { message } = normalizeError({ error });
  const loggerError = `${message} ${stack}`;
  return { ...reportedLog, loggerErrors: [...loggerErrors, loggerError] };
};

module.exports = {
  emitLogEvent,
};
