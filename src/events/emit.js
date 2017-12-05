'use strict';

const { LEVELS } = require('./constants');
const { getPayload } = require('./payload');
const { consolePrint } = require('./console');
const { fireEvent } = require('./fire');

// Emit some event, i.e.:
//  - fire `run` option `events.EVENT(info)`
//  - print to console
const emitEvent = async function ({
  mInput,
  type,
  phase,
  level,
  message,
  info,
  vars,
  runOpts = {},
  schema,
  duration,
  delay,
}) {
  const levelA = getLevel({ level, type });

  const noEvents = !shouldEmit({ runOpts, level: levelA });
  if (noEvents) { return; }

  const eventPayload = getPayload({
    schema,
    mInput,
    type,
    phase,
    level: levelA,
    message,
    info,
    vars,
  });

  consolePrint({ type, level: levelA, phase, message, duration, eventPayload });

  await fireEvent({
    type,
    runOpts,
    schema,
    eventPayload,
    delay,
    emitEvent,
  });

  return eventPayload;
};

// Level defaults to `error` for type `failure`, and to `log` for other types
const getLevel = function ({ level, type }) {
  if (level) { return level; }

  if (type === 'failure') { return 'error'; }

  return 'log';
};

// Can filter verbosity with `run` option `level`
// This won't work for very early startup errors since `runOpts` is not
// parsed yet.
const shouldEmit = function ({ runOpts, level }) {
  return runOpts.level !== 'silent' &&
    LEVELS.indexOf(level) >= LEVELS.indexOf(runOpts.level);
};

module.exports = {
  emitEvent,
};
