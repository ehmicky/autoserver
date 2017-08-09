'use strict';

const { identity } = require('../../utilities');
const { createLog, reportPerf } = require('../../logging');
const { createApiServer } = require('../../events');
const { getServerOpts } = require('../options');

const { handleStartupError } = require('./error');
const { bootAll } = require('./boot');

// Start server for each protocol
// @param {object} serverOpts
const startServer = function (oServerOpts = {}) {
  const apiServer = createApiServer();

  start({ apiServer, oServerOpts })
    // Must use 'start.success' and 'start.failure' events
    .catch(identity);

  return apiServer;
};

const start = async function ({ apiServer, oServerOpts }) {
  const [serverOpts, optsPerf] = await getOpts({ apiServer, oServerOpts });

  const log = createLog({ apiServer, serverOpts, phase: 'startup' });

  const [[, childrenPerf], perf] = await boot({ apiServer, serverOpts, log });

  const measures = [...optsPerf, perf, ...childrenPerf];
  await perfReport({ apiServer, log, measures });
};

// Retrieve server options
const getOpts = async function ({ apiServer, oServerOpts }) {
  try {
    return await getServerOpts(oServerOpts);
  } catch (error) {
    const log = createLog({ apiServer, phase: 'startup' });
    await handleStartupError({ error, apiServer, log });
  }
};

// Main startup function
const boot = async function ({ apiServer, serverOpts, log }) {
  try {
    return await bootAll({ apiServer, serverOpts, startupLog: log });
  } catch (error) {
    await handleStartupError({ error, apiServer, log });
  }
};

// Report startup performance
const perfReport = async function ({ apiServer, log, measures }) {
  try {
    await reportPerf({ log, measures });
  } catch (error) {
    await handleStartupError({ error, apiServer, log });
  }
};

module.exports = {
  startServer,
};
