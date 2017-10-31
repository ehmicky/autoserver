'use strict';

const { getLimits } = require('../../../limits');
const { mergeActions } = require('../merge');

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
  if (data === undefined) { return { actions }; }

  // Top-level `dataPaths`
  const dataPaths = getDataPath({ data, path: commandPath });
  const { maxAttrValueSize } = getLimits({ runOpts });
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
