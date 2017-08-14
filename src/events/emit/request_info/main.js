'use strict';

const { removeKeys } = require('./exclude');
const { renameKeys } = require('./rename');
const { reduceInput } = require('./input');
const { reduceAllModels } = require('./models');
const { trimErrorInfo } = require('./error_info');

// Builds `requestInfo` object, which contains request-related information.
// Also rename `errorReason` to `error`.
// Also remove redundant information between `errorInfo` and `requestInfo`
const getRequestInfo = function ({ reqInfo, phase, runtimeOpts, errorInfo }) {
  if (phase !== 'request') { return {}; }

  const requestInfo = getRequestObject({ reqInfo, runtimeOpts });
  const errorInfoA = trimErrorInfo({ errorInfo });
  return { requestInfo, errorInfo: errorInfoA };
};

const getRequestObject = function ({
  reqInfo = {},
  runtimeOpts: { eventFilter },
}) {
  return processors.reduce(
    (requestInfo, processor) => processor(requestInfo, eventFilter),
    reqInfo,
  );
};

const processors = [
  removeKeys,
  renameKeys,
  reduceInput,
  reduceAllModels,
];

module.exports = {
  getRequestInfo,
};
