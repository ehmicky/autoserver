'use strict';

const { start } = require('../server');

const { getRuntimeOpts } = require('./runtime_opts');

// Start the server, from the CLI
const startCli = function () {
  // eslint-disable-next-line fp/no-mutation
  Error.stackTraceLimit = 100;

  const runtimeOpts = getRuntimeOpts();

  start({ runtime: runtimeOpts })
    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    .catch(() => process.exit(1));
};

module.exports = {
  startCli,
};
