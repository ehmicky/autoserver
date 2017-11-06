'use strict';

const { buildRequestinfo } = require('./builder');
const { reduceInput } = require('./input');
const { reduceAllModels } = require('./models');

// Builds `requestinfo` object, which contains request-related information.
// Also rename `errorReason` to `error`.
// Also remove redundant information between `errorinfo` and `requestinfo`
const getRequestinfo = function ({ mInput, phase, runOpts: { filter } }) {
  if (phase !== 'request') { return; }

  const requestinfo = buildRequestinfo(mInput);
  return processors.reduce(
    (requestinfoA, processor) => processor(requestinfoA, filter),
    requestinfo,
  );
};

const processors = [
  reduceInput,
  reduceAllModels,
];

module.exports = {
  getRequestinfo,
};
