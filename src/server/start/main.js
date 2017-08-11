'use strict';

const { createLog, reportPerf } = require('../../logging');
const { getRuntimeOpts } = require('../../runtime_opts');

const { handleStartupError } = require('./error');
const { bootAll } = require('./boot');

// Start server for each protocol
// @param {object} runtimeOpts
const start = async function ({ runtime: runtimeOptsFile, idl: idlFile } = {}) {
  // Retrieve runtime options
  const earlyLog = createLog({ phase: 'startup' });
  const [runtimeOpts, runtimeOptsPerf] = await eGetRuntimeOpts({
    runtimeOptsFile,
    log: earlyLog,
  });

  // Main startup function
  const log = createLog({ runtimeOpts, phase: 'startup' });
  const [{ startPayload }, perf] = await eBootAll({
    runtimeOpts,
    idlFile,
    log,
    startupLog: log,
  });

  // Report startup performance
  const measures = [...runtimeOptsPerf, ...perf];
  await eReportPerf({ log, measures });

  return startPayload;
};

// Error handling
const handleError = function (func) {
  return async function wrappedFunc (input) {
    try {
      return await func(input);
    } catch (error) {
      const { log } = input;
      await handleStartupError({ error, log });
    }
  };
};

const eGetRuntimeOpts = handleError(getRuntimeOpts);

const eBootAll = handleError(bootAll);

const eReportPerf = handleError(reportPerf);

module.exports = {
  start,
};
