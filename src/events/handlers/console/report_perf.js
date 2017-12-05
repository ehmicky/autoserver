'use strict';

// Report performance by printing it on console
const reportPerf = function ({ measuresmessage }) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log(measuresmessage);
};

module.exports = {
  reportPerf,
};
