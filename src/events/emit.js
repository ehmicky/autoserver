'use strict';

const { addErrorHandler, normalizeError, rethrowError } = require('../error');
const { promiseThen } = require('../utilities');
const { runSchemaFunc } = require('../schema_func');

const { addEventVars } = require('./vars');
const { logEvent } = require('./log');

// Emit some event, i.e.:
//  - fire `run` option `events.EVENT(info)`
//  - print to console
const emitEvent = function ({
  schema,
  mInput = { schema },
  vars,
  runOpts,
  runOpts: { events = {} } = {},
  duration,
  type,
  ...rest
}) {
  const varsA = addEventVars({ vars, type, ...rest });

  const promise = logEvent({ runOpts, mInput, vars: varsA, duration });

  return promiseThen(
    promise,
    () => runSchemaFunc({ schemaFunc: events[type], mInput, vars: varsA }),
  );
};

const emitEventHandler = function (errorObj, { runOpts, schema, type }) {
  const error = normalizeError({ error: errorObj, reason: 'EVENT_ERROR' });
  const vars = { error };
  // Give up if error handler fails
  // I.e. we do not need to `await` this
  silentEmitEvent({ type: 'failure', phase: 'process', runOpts, schema, vars });

  // Failure events are at the top of code stacks. They should not throw.
  if (type === 'failure') { return; }

  rethrowError(errorObj);
};

const eEmitEvent = addErrorHandler(emitEvent, emitEventHandler);

const silentEmitEvent = addErrorHandler(emitEvent);

module.exports = {
  emitEvent: eEmitEvent,
};
