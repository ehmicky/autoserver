'use strict';

const { identity } = require('../../utilities');
const { createLog, reportPerf } = require('../../logging');
const { createApiServer } = require('../../events');
const { getServerOpts } = require('../options');

const { handleStartupError } = require('./error');
const { bootAll } = require('./boot');

// Start server for each protocol
// @param {object} serverOpts
const startServer = function (oServerOpts) {
  const apiServer = createApiServer();

  start({ apiServer, oServerOpts })
    // Must use 'start.success' and 'start.failure' events
    .catch(identity);

  return apiServer;
};

const start = async function ({ apiServer, oServerOpts }) {
  const earlyLog = createLog({ apiServer, phase: 'startup' });
  const [serverOpts, optsPerf] = await eGetServerOpts({
    apiServer,
    oServerOpts,
    log: earlyLog,
  });

  const log = createLog({ apiServer, serverOpts, phase: 'startup' });
  const [[, childrenPerf], perf] = await eBootAll({
    apiServer,
    serverOpts,
    log,
    startupLog: log,
  });

  const measures = [...optsPerf, perf, ...childrenPerf];
  await eReportPerf({ apiServer, log, measures });
};

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

// Retrieve server options
const eGetServerOpts = handleError(getServerOpts);

// Main startup function
const eBootAll = handleError(bootAll);

// Report startup performance
const eReportPerf = handleError(reportPerf);

module.exports = {
  startServer,
};
