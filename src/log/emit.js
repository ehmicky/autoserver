'use strict';

const { addErrorHandler, normalizeError, rethrowError } = require('../error');
const { promiseThen } = require('../utilities');

const { addLogVars } = require('./vars');
const { reportLog } = require('./report');

// Log some event, including printing to console
const logEvent = function ({ schema, mInput, vars, event, ...rest }) {
  const varsA = addLogVars({ vars, event, ...rest });

  const promise = reportLog({ schema, mInput, vars: varsA });

  // We want to make sure this function does not return anything
  const promiseA = promiseThen(promise, () => undefined);
  return promiseA;
};

const logEventHandler = function (error, { schema, event }) {
  const errorA = normalizeError({ error, reason: 'LOG_ERROR' });
  const vars = { error: errorA };
  // Give up if error handler fails
  // I.e. we do not need to `await` this
  silentLogEvent({ event: 'failure', phase: 'process', schema, vars });

  // Failure events are at the top of code stacks. They should not throw.
  if (event === 'failure') { return; }

  rethrowError(error);
};

const eLogEvent = addErrorHandler(logEvent, logEventHandler);

const silentLogEvent = addErrorHandler(logEvent);

module.exports = {
  logEvent: eLogEvent,
};
