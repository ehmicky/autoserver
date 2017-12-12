'use strict';

const { getParams, reduceParams } = require('../functions');

// Get log-specific config parameters
const getLogParams = function ({
  params,
  config,
  mInput = { config },
  event,
  phase,
  level,
  message,
}) {
  const levelA = getLevel({ level, event });

  const paramsA = { ...params, event, phase, level: levelA, message };
  const paramsB = getParams(mInput, { params: paramsA });
  const log = reduceParams({ params: paramsB });

  // Used with `runConfigFunc()` by log providers
  const configFuncInput = { params: { ...paramsA, log }, mInput };

  return { log, configFuncInput };
};

// Level defaults to `error` for event `failure`, and to `log` for other events
const getLevel = function ({ level, event }) {
  if (level) { return level; }

  if (event === 'failure') { return 'error'; }

  return 'log';
};

module.exports = {
  getLogParams,
};
