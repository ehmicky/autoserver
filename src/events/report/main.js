'use strict';

const { LEVELS } = require('../constants');

const { getEventPayload } = require('./payload');
const { getConsoleMessage, consolePrint } = require('./console');
const { fireEvent } = require('./event');

// Emit some event, i.e.:
//  - fire runtime option `events.EVENT(info)`
//  - print to console
const emitEvent = async function ({
  log = { logInfo: {} },
  type,
  phase,
  level,
  message,
  info,
  runtimeOpts = {},
  delay,
}) {
  const levelA = getLevel({ level, type });

  const noEvents = !shouldEmit({ runtimeOpts, level: levelA });
  if (noEvents) { return; }

  // Retrieves information sent to event, and message printed to console
  const eventPayload = getEventPayload({
    log,
    type,
    phase,
    level: levelA,
    runtimeOpts,
    info,
  });
  const messageA = getConsoleMessage({ message, ...eventPayload });
  const eventPayloadA = { ...eventPayload, message: messageA };

  consolePrint({ type, level: levelA, message: messageA });

  const eventPayloadB = await fireEvent({
    log,
    type,
    runtimeOpts,
    eventPayload: eventPayloadA,
    delay,
    emitEvent,
  });
  return eventPayloadB;
};

// Level defaults to `error` for type `failure`, and to `log` for other types
const getLevel = function ({ level, type }) {
  if (level) { return level; }

  if (type === 'failure') { return 'error'; }

  return 'log';
};

// Can filter verbosity with runtime option `eventLevel`
const shouldEmit = function ({ runtimeOpts: { eventLevel }, level }) {
  return eventLevel !== 'silent' &&
    LEVELS.indexOf(level) >= LEVELS.indexOf(eventLevel);
};

module.exports = {
  emitEvent,
};
