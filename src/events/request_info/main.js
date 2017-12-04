'use strict';

const { buildRequestinfo } = require('./builder');
const { reduceInput } = require('./input');
const { reduceAllModels } = require('./models');

// Builds `requestinfo` object, which contains request-related information.
const getRequestinfo = function ({ mInput, phase }) {
  if (phase !== 'request') { return; }

  const requestinfo = buildRequestinfo(mInput);
  return processors.reduce(
    (requestinfoA, processor) => processor(requestinfoA),
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
