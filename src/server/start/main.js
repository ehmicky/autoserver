'use strict';

const { reportPerf } = require('../../logging');
const { getRuntimeOpts } = require('../../runtime_opts');

const { handleStartupError } = require('./error');
const { bootAll } = require('./boot');

// Start server for each protocol
// @param {object} runtimeOpts
const start = async function ({ runtime: runtimeOptsFile, idl: idlFile } = {}) {
  // Retrieve runtime options
  const [runtimeOpts, runtimeOptsPerf] = await eGetRuntimeOpts({
    runtimeOptsFile,
  });

  // Main startup function
  const [{ startPayload }, perf] = await eBootAll({ runtimeOpts, idlFile });

  // Report startup performance
  const measures = [...runtimeOptsPerf, ...perf];
  await eReportPerf({ phase: 'startup', measures, runtimeOpts });

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

const eReportPerf = handleError(reportPerf);

module.exports = {
  start,
};
