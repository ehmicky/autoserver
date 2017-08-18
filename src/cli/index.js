'use strict';

const { start } = require('../server');

const startCli = function () {
  // eslint-disable-next-line fp/no-mutation
  Error.stackTraceLimit = 100;

  // Pass ENVVAR along
  //
  // Keep process.cwd() for files search
  //
  // No validation
  //
  // --idl PATH -> start({ idl })
  // --runtime PATH -> start({ runtime })
  // --opt VAL -> start({ runtime: { OPT }})
  //
  // Correct exit code

  start()
    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    .catch(() => process.exit(1));
};

module.exports = {
  startCli,
};
