'use strict';

const { normalizeError, getStandardError } = require('../../error');
const { pSetTimeout, makeAlmostImmutable } = require('../../utilities');

// Try emit events with an increasing delay
const eFireEvent = async function ({
  log,
  type,
  eventPayload,
  runtimeOpts,
  delay = defaultDelay,
  emitEvent,
}) {
  try {
    return await fireEvent({ runtimeOpts, type, eventPayload });
  } catch (error) {
    await handleEventError({
      log,
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
  runtimeOpts: { events },
  type,
  eventPayload,
}) {
  const eventHandler = events[type];
  if (!eventHandler) { return; }

  const eventPayloadA = makeAlmostImmutable(eventPayload, ['servers']);
  await eventHandler(eventPayloadA);

  return eventPayloadA;
};

const handleEventError = async function ({
  log,
  type,
  eventPayload,
  runtimeOpts,
  error,
  delay,
  emitEvent,
}) {
  // Tries again ang again, with an increasing delay
  if (delay > maxDelay) { return; }
  await pSetTimeout(delay);
  const delayA = delay * delayExponent;

  // First, report that event handler failed
  await fireEventError({
    log,
    error,
    runtimeOpts,
    delay: delayA,
    emitEvent,
  });

  // Then, try to report original error again
  await eFireEvent({
    log,
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
  log,
  error,
  runtimeOpts,
  delay,
  emitEvent,
}) {
  // Do not report event error created by another event error
  // I.e. only report the first one, but tries to report it again and again
  if (delay > defaultDelay * delayExponent) { return; }

  const errorA = normalizeError({ error, reason: 'EVENT_ERROR' });
  const errorB = getStandardError({ log, error: errorA });
  await emitEvent({
    log,
    type: 'failure',
    phase: 'process',
    runtimeOpts,
    info: { errorInfo: errorB },
    delay,
  });
};

module.exports = {
  fireEvent: eFireEvent,
};
