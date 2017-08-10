'use strict';

const { identity } = require('../../utilities');
const { createLog, reportPerf } = require('../../logging');
const { createApiServer } = require('../../events');
const { getServerOpts } = require('../options');

const { handleStartupError } = require('./error');
const { bootAll } = require('./boot');

// Start server for each protocol
// @param {object} serverOpts
const startServer = function ({ opts: serverOptsFile } = {}) {
  const apiServer = createApiServer();

  start({ apiServer, serverOptsFile })
    // Must use 'start.success' and 'start.failure' events
    .catch(identity);

  return apiServer;
};

const start = async function ({ apiServer, serverOptsFile }) {
  // Retrieve server options
  const earlyLog = createLog({ apiServer, phase: 'startup' });
  const [serverOpts, optsPerf] = await eGetServerOpts({
    apiServer,
    serverOptsFile,
    log: earlyLog,
  });

  // Main startup function
  const log = createLog({ apiServer, serverOpts, phase: 'startup' });
  const [[, childrenPerf], perf] = await eBootAll({
    apiServer,
    serverOpts,
    log,
    startupLog: log,
  });

  // Report startup performance
  const measures = [...optsPerf, perf, ...childrenPerf];
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

const eGetServerOpts = handleError(getServerOpts);

const eBootAll = handleError(bootAll);

const eReportPerf = handleError(reportPerf);

module.exports = {
  startServer,
};
