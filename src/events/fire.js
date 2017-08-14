'use strict';

const { normalizeError, getStandardError } = require('../error');
const { pSetTimeout, makeImmutable } = require('../utilities');

// Try emit events with an increasing delay
const eFireEvent = async function ({
  type,
  eventPayload,
  runtimeOpts,
  delay = defaultDelay,
  emitEvent,
}) {
  try {
    await fireEvent({ runtimeOpts, type, eventPayload });

    // Catch-all event type
    await fireEvent({ runtimeOpts, type: 'any', eventPayload });
  } catch (error) {
    await handleEventError({
      type,
      eventPayload,
      runtimeOpts,
      error,
      delay,
      emitEvent,
    });
  }
};

const fireEvent = async function ({
  runtimeOpts: { events = {} },
  type,
  eventPayload,
}) {
  const eventHandler = events[type];
  if (!eventHandler) { return; }

  const eventPayloadA = makeImmutable(eventPayload);
  await eventHandler(eventPayloadA);

  return eventPayloadA;
};

const handleEventError = async function ({
  type,
  eventPayload,
  runtimeOpts,
  error,
  delay,
  emitEvent,
}) {
  // Tries again and again, with an increasing delay
  if (delay > maxDelay) { return; }
  await pSetTimeout(delay);
  const delayA = delay * delayExponent;

  // First, report that event handler failed
  await fireEventError({ error, runtimeOpts, delay: delayA, emitEvent });

  // Then, try to report original error again
  await eFireEvent({
    type,
    eventPayload,
    runtimeOpts,
    delay: delayA,
    emitEvent,
  });
};

const defaultDelay = 1000;
const delayExponent = 5;
const maxDelay = 1000 * 60 * 3;

const fireEventError = async function ({
  error,
  runtimeOpts,
  delay,
  emitEvent,
}) {
  // Do not report event error created by another event error
  // I.e. only report the first one, but tries to report it again and again
  if (delay > defaultDelay * delayExponent) { return; }

  const errorA = normalizeError({ error, reason: 'EVENT_ERROR' });
  const errorB = getStandardError({ error: errorA });
  await emitEvent({
    type: 'failure',
    phase: 'process',
    runtimeOpts,
    errorInfo: errorB,
    delay,
  });
};

module.exports = {
  fireEvent: eFireEvent,
};
