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
    filter: ['data'],
    mapper: getDataAction,
    ...rest,
  });
  return { actions: actionsA };
};

const getDataAction = function ({
  top,
  top: { command },
  action: { args: { data }, commandpath },
  schema: { shortcuts: { collsMap, userDefaultsMap } },
  mInput,
  runOpts,
  dbAdapters,
}) {
  const { maxAttrValueSize } = getLimits({ runOpts });
  validateLimits({ data, runOpts });

  // Top-level `dataPaths`
  const dataPaths = getDataPath({ data, commandpath });

  const dataA = parseData({
    data,
    commandpath,
    command,
    top,
    mInput,
    maxAttrValueSize,
    collsMap,
    userDefaultsMap,
    dbAdapters,
  });

  const newActions = parseActions({
    data: dataA,
    commandpath,
    dataPaths,
    top,
    collsMap,
  });

  return newActions;
};

module.exports = {
  parseDataArg,
};
