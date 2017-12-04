'use strict';

const { addErrorHandler, normalizeError, rethrowError } = require('../error');
const { makeImmutable, identity } = require('../utilities');

// Fire event handler
const fireEvent = async function ({ type, eventPayload, runOpts }) {
  await fireSingleEvent({ runOpts, type, eventPayload });

  // Catch-all event type
  await fireSingleEvent({ runOpts, type: 'any', eventPayload });
};

const fireSingleEvent = async function ({
  runOpts: { events = {} },
  type,
  eventPayload,
}) {
  const eventHandler = events[type];
  if (eventHandler === undefined) { return; }

  const eventPayloadA = makeImmutable(eventPayload);
  await eventHandler(eventPayloadA);
};

const handleEventError = function (
  errorObj,
  { runOpts, schema, type, emitEvent },
) {
  // Failure events are at the top of code stacks. They should not throw.
  if (type === 'failure') { return; }

  const error = normalizeError({ error: errorObj, reason: 'EVENT_ERROR' });
  // Give up if error handler fails
  // I.e. we do not need to `await` this
  emitEvent({ type: 'failure', phase: 'process', runOpts, schema, error })
    .catch(identity);

  rethrowError(errorObj);
};

const eFireEvent = addErrorHandler(fireEvent, handleEventError);

module.exports = {
  fireEvent: eFireEvent,
};
