'use strict';

const { rethrowError } = require('../../error');
const { monitoredReduce } = require('../../perf');
const { setupGracefulExit, gracefulExit } = require('../exit');

const { emitStartEvent } = require('./event');

const afterStart = function (initialInput) {
  return monitoredReduce({
    funcs: startSteps,
    initialInput,
    mapResponse: (newInput, input) => ({ ...input, ...newInput }),
  });
};

// Make sure servers are properly closed if an exception is thrown at end
// of startup, e.g. during start event handler
const handleError = function (func) {
  return async val => {
    try {
      return await func(val);
    } catch (error) {
      const { servers, runtimeOpts } = val;
      await gracefulExit({ servers, runtimeOpts });

      rethrowError(error);
    }
  };
};

const eAfterStart = handleError(afterStart);

// Each of the steps performed at startup
const startSteps = [
  setupGracefulExit,
  emitStartEvent,
];

module.exports = {
  afterStart: eAfterStart,
};
