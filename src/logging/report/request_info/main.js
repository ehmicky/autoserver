'use strict';

const { removeKeys } = require('./exclude');
const { renameKeys } = require('./rename');
const { reduceInput } = require('./input');
const { reduceAllModels } = require('./models');
const { trimErrorInfo } = require('./error_info');

// Builds `requestInfo` object, which contains request-related log information.
// Also rename `errorReason` to `error`.
// Also remove redundant information between `errorInfo` and `requestInfo`
const getRequestInfo = function ({ log, phase, errorInfo }) {
  if (phase !== 'request') { return {}; }

  const requestInfo = getRequestObject({ log });
  const errorInfoA = trimErrorInfo({ errorInfo });
  return { requestInfo, errorInfo: errorInfoA };
};

const getRequestObject = function ({
  log: { runtimeOpts: { logFilter }, logInfo },
}) {
  return processors.reduce(
    (requestInfo, processor) => processor(requestInfo, logFilter),
    logInfo,
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
