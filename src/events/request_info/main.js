'use strict';

const { buildRequestInfo } = require('./builder');
const { reduceInput } = require('./input');
const { reduceAllModels } = require('./models');

// Builds `requestInfo` object, which contains request-related information.
// Also rename `errorReason` to `error`.
// Also remove redundant information between `errorInfo` and `requestInfo`
const getRequestInfo = function ({ mInput, phase, runOpts: { filter } }) {
  if (phase !== 'request') { return; }

  const requestInfo = buildRequestInfo(mInput);
  return processors.reduce(
    (requestInfoA, processor) => processor(requestInfoA, filter),
    requestInfo,
  );
};

const processors = [
  reduceInput,
  reduceAllModels,
];

module.exports = {
  getRequestInfo,
};
