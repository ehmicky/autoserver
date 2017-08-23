'use strict';

const { buildRequestInfo } = require('./builder');
const { reduceInput } = require('./input');
const { reduceAllModels } = require('./models');
const { trimErrorInfo } = require('./error_info');

// Builds `requestInfo` object, which contains request-related information.
// Also rename `errorReason` to `error`.
// Also remove redundant information between `errorInfo` and `requestInfo`
const getRequestInfo = function ({ input, phase, runOpts, errorInfo }) {
  if (phase !== 'request') { return { errorInfo }; }

  const requestInfo = getRequestObject({ input, runOpts });
  const errorInfoA = trimErrorInfo({ errorInfo });
  return { requestInfo, errorInfo: errorInfoA };
};

const getRequestObject = function ({
  input,
  runOpts: { eventFilter },
}) {
  const requestInfo = buildRequestInfo(input);
  return processors.reduce(
    (requestInfoA, processor) => processor(requestInfoA, eventFilter),
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
