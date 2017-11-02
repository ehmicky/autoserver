'use strict';

const { assignArray } = require('../../../utilities');
const { getLimits } = require('../../../limits');
const { mergeActions } = require('../merge');

const { validateLimits } = require('./limits');
const { getDataPath } = require('./data_path');
const { parseData } = require('./data');
const { parseActions } = require('./actions');

// Parse `args.data` into write `actions`
const parseDataArg = function ({ actions, ...rest }) {
  const newActions = actions
    .map(action => parseDataAction({ action, ...rest }))
    .reduce(assignArray, []);
  if (newActions.length === 0) { return; }

  const actionsA = mergeActions({ actions, newActions });

  return { actions: actionsA };
};

const parseDataAction = function ({
  top,
  top: { command },
  action: { args: { data }, commandPath },
  schema: { shortcuts: { modelsMap, userDefaultsMap } },
  mInput,
  runOpts,
  dbAdapters,
}) {
  if (data === undefined) { return []; }

  const { maxAttrValueSize } = getLimits({ runOpts });
  validateLimits({ data, runOpts });

  // Top-level `dataPaths`
  const dataPaths = getDataPath({ data, commandPath });

  const dataA = parseData({
    data,
    commandPath,
    command,
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

  return newActions;
};

module.exports = {
  parseDataArg,
};
