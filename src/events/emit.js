'use strict';

const { addErrorHandler, normalizeError, rethrowError } = require('../error');
const { promiseThen } = require('../utilities');
const { runSchemaFunc } = require('../schema_func');

const { addEventVars } = require('./vars');
const { reportLog } = require('./log');

// Emit some event, i.e.:
//  - fire schema function `schema.events.EVENT(vars)`
//  - print to console
const emitEvent = function ({
  schema,
  schema: { events = {} },
  mInput = { schema },
  vars,
  duration,
  type,
  ...rest
}) {
  const varsA = addEventVars({ vars, type, ...rest });

  const promise = reportLog({ schema, mInput, vars: varsA, duration });

  const promiseA = promiseThen(
    promise,
    () => runSchemaFunc({ schemaFunc: events[type], mInput, vars: varsA }),
  );

  // We want to make sure this function does not return anything
  const promiseB = promiseThen(promiseA, () => undefined);
  return promiseB;
};

const emitEventHandler = function (errorObj, { schema, type }) {
  const error = normalizeError({ error: errorObj, reason: 'EVENT_ERROR' });
  const vars = { error };
  // Give up if error handler fails
  // I.e. we do not need to `await` this
  silentEmitEvent({ type: 'failure', phase: 'process', schema, vars });

  // Failure events are at the top of code stacks. They should not throw.
  if (type === 'failure') { return; }

  rethrowError(errorObj);
};

const eEmitEvent = addErrorHandler(emitEvent, emitEventHandler);

const silentEmitEvent = addErrorHandler(emitEvent);

module.exports = {
  emitEvent: eEmitEvent,
};
