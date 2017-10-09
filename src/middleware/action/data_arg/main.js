'use strict';

const { getLimits } = require('../../../limits');

const { getDataPath } = require('./data_path');
const { parseData } = require('./data');
const { parseActions } = require('./actions');
const { mergeActions } = require('./merge');

// Parse `args.data` into write `actions`
const parseDataArg = function ({
  actions,
  top,
  top: { args: { data }, commandPath },
  schema: { shortcuts: { modelsMap, userDefaultsMap } },
  mInput,
  runOpts,
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
  });

  const actionsA = parseActions({
    data: dataA,
    commandPath,
    dataPaths,
    top,
    modelsMap,
  });

  const actionsB = mergeActions({
    readActions: actions,
    writeActions: actionsA,
  });

  return { actions: actionsB };
};

module.exports = {
  parseDataArg,
};
