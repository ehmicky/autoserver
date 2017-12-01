'use strict';

const { addErrorHandler, normalizeError } = require('../error');
const { makeImmutable } = require('../utilities');

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

const handleEventError = async function (
  error,
  { runOpts, schema, emitEvent, noHandling },
) {
  // If error handler of error handler fails itself, give up
  if (noHandling) { return; }

  const errorA = normalizeError({ error, reason: 'EVENT_ERROR' });
  await emitEvent({
    type: 'failure',
    phase: 'process',
    runOpts,
    schema,
    errorinfo: errorA,
    noHandling: true,
  });
};

const eFireEvent = addErrorHandler(fireEvent, handleEventError);

module.exports = {
  fireEvent: eFireEvent,
};
