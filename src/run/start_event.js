'use strict';

const { emitEvent } = require('../events');
const { mapValues, omit, has, set, get, pSetTimeout } = require('../utilities');

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

  // Let other events finish first
  await pSetTimeout(0, { unref: false });

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
    serverFacts => omit(serverFacts, ['server', 'protocolHandler']),
  );
  const options = getOptions({ runOpts });
  return { servers: serversA, options, exit: gracefulExit };
};

const getOptions = function ({ runOpts }) {
  const runOptsA = omit(runOpts, 'schema');
  const runOptsB = replaceDataPath({ runOpts: runOptsA });
  return runOptsB;
};

const replaceDataPath = function ({ runOpts }) {
  if (!has(runOpts, DATA_PATH)) { return runOpts; }

  const runOptsA = set(runOpts, [...DATA_PATH, 'content'], undefined);
  const path = get(runOptsA, [...DATA_PATH, 'path']);
  const runOptsB = set(runOptsA, DATA_PATH, path);
  return runOptsB;
};

const DATA_PATH = ['db', 'memory', 'data'];

module.exports = {
  emitStartEvent,
};
