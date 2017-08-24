'use strict';

const { pSetTimeout, identity } = require('../utilities');

const { LEVELS } = require('./constants');
const { getPayload } = require('./payload');
const { consolePrint } = require('./console');
const { fireEvent } = require('./fire');

// `await emitEvent({})` should not block, except when we want the return value
const emitEvent = function ({ async = true, ...rest }) {
  if (!async) {
    return emit({ async, ...rest });
  }

  emit({ async, ...rest }).catch(identity);
};

// Emit some event, i.e.:
//  - fire `run` option `events.EVENT(info)`
//  - print to console
const emit = async function ({
  mInput,
  errorInfo,
  type,
  phase,
  level,
  message,
  info,
  runOpts = {},
  async,
  delay,
}) {
  const levelA = getLevel({ level, type });

  const noEvents = !shouldEmit({ runOpts, level: levelA });
  if (noEvents) { return; }

  // Event emitting has low priority, so run this in a different macrotask
  if (async) {
    await pSetTimeout(0, { unref: false });
  }

  const { eventPayload, message: messageA } = getPayload({
    mInput,
    errorInfo,
    type,
    phase,
    level: levelA,
    message,
    info,
    runOpts,
  });

  consolePrint({ type, level: levelA, message: messageA });

  await fireEvent({ type, runOpts, eventPayload, delay, emitEvent });

  return eventPayload;
};

// Level defaults to `error` for type `failure`, and to `log` for other types
const getLevel = function ({ level, type }) {
  if (level) { return level; }

  if (type === 'failure') { return 'error'; }

  return 'log';
};

// Can filter verbosity with `run` option `eventLevel`
// This won't work for very early startup errors since `runOpts` is not
// parsed yet.
const shouldEmit = function ({ runOpts: { eventLevel }, level }) {
  return eventLevel !== 'silent' &&
    LEVELS.indexOf(level) >= LEVELS.indexOf(eventLevel);
};

module.exports = {
  emitEvent,
};
