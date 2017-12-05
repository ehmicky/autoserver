'use strict';

// eslint-disable-next-line fp/no-let
let logger = function ({ log }) {
  const jsonPayload = JSON.stringify(log, null, 2);
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log('Log', jsonPayload);
};

// This file is for debugging only. Comment this to enable it.
// eslint-disable-next-line fp/no-mutation, no-empty-function
logger = () => {};

module.exports = logger;
