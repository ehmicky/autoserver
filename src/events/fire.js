'use strict';

const { addErrorHandler, normalizeError } = require('../error');
const { pSetTimeout, makeImmutable } = require('../utilities');
const { getLimits } = require('../limits');

// Try emit events with an increasing delay
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
  if (!eventHandler) { return; }

  const eventPayloadA = makeImmutable(eventPayload);
  await eventHandler(eventPayloadA);

  return eventPayloadA;
};

const handleEventError = async function (error, {
  type,
  eventPayload,
  runOpts,
  delay = DEFAULT_DELAY,
  emitEvent,
}) {
  // Tries again and again, with an increasing delay
  const { maxEventDelay } = getLimits({ runOpts });
  if (delay > maxEventDelay) { return; }
  await pSetTimeout(delay);
  const delayA = delay * DELAY_EXPONENT;

  // First, report that event handler failed
  await fireEventError({ error, runOpts, delay: delayA, emitEvent });

  // Then, try to report original error again
  await eFireEvent({
    type,
    eventPayload,
    runOpts,
    delay: delayA,
    emitEvent,
  });
};

const eFireEvent = addErrorHandler(fireEvent, handleEventError);

const DEFAULT_DELAY = 1000;
const DELAY_EXPONENT = 5;

const fireEventError = async function ({
  error,
  runOpts,
  delay,
  emitEvent,
}) {
  // Do not report event error created by another event error
  // I.e. only report the first one, but tries to report it again and again
  if (delay > DEFAULT_DELAY * DELAY_EXPONENT) { return; }

  const errorA = normalizeError({ error, reason: 'EVENT_ERROR' });
  await emitEvent({
    type: 'failure',
    phase: 'process',
    runOpts,
    errorInfo: errorA,
    delay,
  });
};

module.exports = {
  fireEvent: eFireEvent,
};
