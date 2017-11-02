'use strict';

const { getLimits } = require('../../../limits');
const { mergeActions } = require('../merge');

const { validateLimits } = require('./limits');
const { getDataPath } = require('./data_path');
const { parseData } = require('./data');
const { parseActions } = require('./actions');

// Parse `args.data` into write `actions`
const parseDataArg = function ({
  actions,
  top,
  top: { args: { data }, commandPath },
  schema: { shortcuts: { modelsMap, userDefaultsMap } },
  mInput,
  runOpts,
  dbAdapters,
}) {
  // Only if `args.data` is defined
  if (data === undefined) { return; }

  const { maxAttrValueSize } = getLimits({ runOpts });
  validateLimits({ data, runOpts });

  // Top-level `dataPaths`
  const dataPaths = getDataPath({ data, commandPath });

  const dataA = parseData({
    data,
    commandPath,
    top,
    mInput,
    maxAttrValueSize,
    modelsMap,
    userDefaultsMap,
    dbAdapters,
  });

  const newActions = parseActions({
    data: dataA,
    commandPath,
    dataPaths,
    top,
    modelsMap,
  });

  const actionsA = mergeActions({ actions, newActions });

  return { actions: actionsA };
};

module.exports = {
  parseDataArg,
};
