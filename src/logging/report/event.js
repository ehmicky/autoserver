'use strict';

const { normalizeError } = require('../../error');
const { pSetTimeout } = require('../../utilities');

// Try emit log event with an increasing delay
const emitLogEvent = async function ({
  apiServer,
  eventName,
  reportedLog,
  delay = defaultDelay,
}) {
  try {
    await apiServer.emitAsync(eventName, reportedLog);
  } catch (error) {
    if (delay > maxDelay) { return; }
    await pSetTimeout(delay);

    const newReportedLog = addLoggerError({ reportedLog, error });
    const newDelay = delay * delayExponent;
    await emitLogEvent({
      apiServer,
      eventName,
      reportedLog: newReportedLog,
      delay: newDelay,
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
  const newLoggerError = `${message} ${stack}`;
  const newLoggerErrors = [...loggerErrors, newLoggerError];
  return Object.assign({}, reportedLog, { loggerErrors: newLoggerErrors });
};

module.exports = {
  emitLogEvent,
};
