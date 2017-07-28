'use strict';

const { createLog, reportPerf } = require('../logging');
const { monitor, monitoredReduce } = require('../perf');
const { makeImmutable } = require('../utilities');

const { createApiServer } = require('./api_server');
const { handleStartupError } = require('./startup_error');
const { startSteps } = require('./start_steps');

/**
 * Start server for each protocol
 *
 * @param {object} serverOpts
 */
const startServer = function (oServerOpts = {}) {
  const apiServer = createApiServer({ oServerOpts });
  const startupLog = createLog({
    serverOpts: oServerOpts,
    apiServer,
    phase: 'startup',
  });

  start({ oServerOpts, startupLog, apiServer })
    .catch(error => handleStartupError({ error, startupLog, apiServer }));

  makeImmutable(apiServer);
  return apiServer;
};

const start = async function (input) {
  const { startupLog } = input;
  const [[, childrenPerf], perf] = await monitoredStartAll(input);

  const measures = [perf, ...childrenPerf];
  await reportPerf({ log: startupLog, measures });
};

const startAll = function (initialInput) {
  return monitoredReduce({
    funcs: startSteps,
    initialInput,
    mapResponse: (newInput, input) => ({ ...input, ...newInput }),
  });
};

const monitoredStartAll = monitor(startAll, 'all', 'all');

module.exports = {
  startServer,
};
