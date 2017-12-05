'use strict';

// Report log by printing it on console
const report = function ({ logInfo }) {
  const logInfoA = JSON.stringify(logInfo, null, 2);

  // eslint-disable-next-line no-console, no-restricted-globals
  console.log(logInfoA);
};

module.exports = {
  report,
};
