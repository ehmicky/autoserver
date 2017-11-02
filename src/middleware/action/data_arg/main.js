'use strict';

const { getLimits } = require('../../../limits');
const { addActions } = require('../add_actions');

const { validateLimits } = require('./limits');
const { getDataPath } = require('./data_path');
const { parseData } = require('./data');
const { parseActions } = require('./actions');

// Parse `args.data` into write `actions`
const parseDataArg = function ({ actions, ...rest }) {
  const actionsA = addActions({
    actions,
    filter: ({ data }) => data !== undefined,
    mapper: getDataAction,
    ...rest,
  });
  return { actions: actionsA };
};

const getDataAction = function ({
  top,
  top: { command },
  action: { args: { data }, commandPath },
  schema: { shortcuts: { modelsMap, userDefaultsMap } },
  mInput,
  runOpts,
  dbAdapters,
}) {
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
