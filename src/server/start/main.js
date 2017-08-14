'use strict';

const { emitPerfEvent } = require('../../perf');
const { getRuntimeOpts } = require('../../runtime_opts');

const { handleStartupError } = require('./error');
const { bootAll } = require('./boot');
const { afterStart } = require('./after');

// Start server for each protocol
// @param {object} runtimeOpts
const start = async function ({ runtime: runtimeOptsFile, idl: idlFile } = {}) {
  // Retrieve runtime options
  const [runtimeOpts, runtimeOptsPerf] = await eGetRuntimeOpts({
    runtimeOptsFile,
  });

  // Main startup function
  const [{ servers }, bootPerf] = await eBootAll({ runtimeOpts, idlFile });

  // Fired after the servers have started
  const [{ startPayload }, afterPerf] = await eAfterStart({
    servers,
    runtimeOpts,
  });

  // Report startup performance
  const measures = [...runtimeOptsPerf, ...bootPerf, ...afterPerf];
  await eEmitPerfEvent({ phase: 'startup', measures, runtimeOpts });

  return startPayload;
};

// Error handling
const handleError = function (func) {
  return async function wrappedFunc (input) {
    try {
      return await func(input);
    } catch (error) {
      const { runtimeOpts } = input;
      await handleStartupError({ error, runtimeOpts });
    }
  };
};

const eGetRuntimeOpts = handleError(getRuntimeOpts);

const eBootAll = handleError(bootAll);

const eAfterStart = handleError(afterStart);

const eEmitPerfEvent = handleError(emitPerfEvent);

module.exports = {
  start,
};
