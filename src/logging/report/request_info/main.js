'use strict';

const { removeKeys } = require('./exclude');
const { renameKeys } = require('./rename');
const { reduceInput } = require('./input');
const { reduceAllModels } = require('./models');
const { trimErrorInfo } = require('./error_info');

// Builds `requestInfo` object, which contains request-related log information.
// Also rename `errorReason` to `error`.
// Also remove redundant information between `errorInfo` and `requestInfo`
const getRequestInfo = function ({
  log: { phase, serverOpts: { loggerFilter }, logInfo },
  info,
}) {
  if (phase !== 'request') { return; }

  const requestInfo = getRequestObject(logInfo, loggerFilter);
  const errorInfo = trimErrorInfo({ info });
  return { requestInfo, errorInfo };
};

const getRequestObject = function (log, loggerFilter) {
  return processors.reduce(
    (requestInfo, processor) => processor(requestInfo, loggerFilter),
    log,
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
