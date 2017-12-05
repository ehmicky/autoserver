'use strict';

// eslint-disable-next-line fp/no-let
let perfEvent = function (payload) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log(`Performance logging info\n${payload.measuresmessage}`);
};

// This file is for debugging only. Comment this to enable it.
// eslint-disable-next-line fp/no-mutation, no-empty-function
perfEvent = () => {};

module.exports = perfEvent;
