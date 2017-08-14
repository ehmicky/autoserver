'use strict';

const { pSetTimeout } = require('../../utilities');
const { LEVELS } = require('../constants');

const { getPayload } = require('./payload');
const { consolePrint } = require('./console');
const { fireEvent } = require('./event');

// Emit some event, i.e.:
//  - fire runtime option `events.EVENT(info)`
//  - print to console
const emitEvent = async function ({
  reqInfo,
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

  // Event emitting has low priority, so run this in a different macrotask
  await pSetTimeout(0);

  const { eventPayload, message: messageA } = getPayload({
    reqInfo,
    type,
    phase,
    level: levelA,
    message,
    runtimeOpts,
    info,
  });

  consolePrint({ type, level: levelA, message: messageA });

  await fireEvent({ type, runtimeOpts, eventPayload, delay, emitEvent });

  return eventPayload;
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
