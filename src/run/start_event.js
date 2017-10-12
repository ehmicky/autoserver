'use strict';

const { emitEvent } = require('../events');
const { mapValues, omit, has, set, get } = require('../utilities');

// Create event when all protocol-specific servers have started
const emitStartEvent = async function ({
  servers,
  runOpts,
  gracefulExit,
  measures,
}) {
  const message = 'Server is ready';
  const info = getPayload({ servers, runOpts, gracefulExit });
  const { duration } = measures.find(({ category }) => category === 'default');
  const startPayload = await emitEvent({
    type: 'start',
    phase: 'startup',
    message,
    info,
    runOpts,
    async: false,
    duration,
  });
  return { startPayload };
};

// Remove some properties from event payload as they are not serializable,
// or should not be made immutable
const getPayload = function ({ servers, runOpts, gracefulExit }) {
  const serversA = mapValues(
    servers,
    serverFacts => omit(serverFacts, 'server'),
  );
  const options = getOptions({ runOpts });
  return { servers: serversA, options, exit: gracefulExit };
};

const getOptions = function ({ runOpts }) {
  const runOptsA = omit(runOpts, 'schema');

  if (!has(runOptsA, dataPath)) { return runOptsA; }

  const runOptsB = set(runOptsA, [...dataPath, 'content'], undefined);
  const path = get(runOptsB, [...dataPath, 'path']);
  const runOptsC = set(runOptsB, dataPath, path);
  return runOptsC;
};

const dataPath = ['db', 'memory', 'data'];

module.exports = {
  emitStartEvent,
};
