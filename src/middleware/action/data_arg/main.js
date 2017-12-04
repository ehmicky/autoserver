'use strict';

const { getLimits } = require('../../../limits');
const { addActions } = require('../add_actions');

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
  schema,
  schema: { shortcuts: { userDefaultsMap } },
  mInput,
  runOpts,
  dbAdapters,
}) {
  const { maxAttrValueSize } = getLimits({ runOpts });

  // Top-level `dataPaths`
  const dataPaths = getDataPath({ data, commandpath });

  const dataA = parseData({
    data,
    commandpath,
    command,
    top,
    mInput,
    maxAttrValueSize,
    schema,
    userDefaultsMap,
    dbAdapters,
  });

  const newActions = parseActions({
    data: dataA,
    commandpath,
    dataPaths,
    top,
    schema,
  });

  return newActions;
};

module.exports = {
  parseDataArg,
};
