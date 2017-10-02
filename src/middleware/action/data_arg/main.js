'use strict';

const { getDataPath } = require('./data_path');
const { parseData } = require('./parse');
const { mergeActions } = require('./merge');

// Parse `args.data` into write `actions`
const parseDataArg = function ({
  actions,
  top,
  top: { args: { data }, commandPath },
  idl: { shortcuts: { modelsMap } },
}) {
  // Only if `args.data` is defined
  if (data === undefined) { return { actions }; }

  // Top-level `dataPaths`
  const dataPaths = getDataPath({ data, path: commandPath });
  const actionsA = parseData({ data, commandPath, dataPaths, top, modelsMap });
  const actionsB = mergeActions({
    readActions: actions,
    writeActions: actionsA,
  });
  return { actions: actionsB };
};

module.exports = {
  parseDataArg,
};
