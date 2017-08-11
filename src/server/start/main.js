'use strict';

const { identity } = require('../../utilities');
const { createLog, reportPerf } = require('../../logging');
const { createApiServer } = require('../../events');
const { getRuntimeOpts } = require('../runtime_opts');

const { handleStartupError } = require('./error');
const { bootAll } = require('./boot');

// Start server for each protocol
// @param {object} runtimeOpts
const start = function ({ runtime: runtimeOptsFile, idl: idlFile } = {}) {
  const apiServer = createApiServer();

  startServer({ apiServer, runtimeOptsFile, idlFile })
    // Must use 'start.success' and 'start.failure' events
    .catch(identity);

  return apiServer;
};

const startServer = async function ({ apiServer, runtimeOptsFile, idlFile }) {
  // Retrieve runtime options
  const earlyLog = createLog({ apiServer, phase: 'startup' });
  const [runtimeOpts, runtimeOptsPerf] = await eGetRuntimeOpts({
    apiServer,
    runtimeOptsFile,
    log: earlyLog,
  });

  // Main startup function
  const log = createLog({ apiServer, runtimeOpts, phase: 'startup' });
  const [[, childrenPerf], perf] = await eBootAll({
    apiServer,
    runtimeOpts,
    idlFile,
    log,
    startupLog: log,
  });

  // Report startup performance
  const measures = [...runtimeOptsPerf, perf, ...childrenPerf];
  await eReportPerf({ apiServer, log, measures });
};

// Error handling
const handleError = function (func) {
  return async function wrappedFunc (input) {
    try {
      return await func(input);
    } catch (error) {
      const { apiServer, log } = input;
      await handleStartupError({ error, apiServer, log });
    }
  };
};

const eGetRuntimeOpts = handleError(getRuntimeOpts);

const eBootAll = handleError(bootAll);

const eReportPerf = handleError(reportPerf);

module.exports = {
  start,
};
