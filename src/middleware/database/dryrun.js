'use strict';

// Make write commands not change data, if argument `dryrun` is used
const applyDryRun = function ({ args: { dryrun }, args, command }) {
  if (!dryrun || command === 'read') { return; }

  return dryRunByCommand[command]({ args });
};

// `delete` commands becomes read commands
const getReadCommand = function () {
  return { command: 'read' };
};

// `replace`, `create` and `upsert` commands reuse `args.newData` as is
const useNewData = function ({ args: { newData: data } }) {
  return { response: { data } };
};

const dryRunByCommand = {
  delete: getReadCommand,
  create: useNewData,
  update: useNewData,
  upsert: useNewData,
};

module.exports = {
  applyDryRun,
};
