'use strict';

const { reduceInput } = require('./input');
const { reduceAllModels } = require('./models');

// Builds `requestinfo` object, which contains request-related information.
const getRequestinfo = function ({ eventPayload, phase }) {
  if (phase !== 'request') { return; }

  return processors.reduce(
    (requestinfoA, processor) => processor(requestinfoA),
    eventPayload,
  );
};

const processors = [
  reduceInput,
  reduceAllModels,
];

module.exports = {
  getRequestinfo,
};
