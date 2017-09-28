'use strict';

// Make write commands not change data, if argument `dryrun` is used
const applyDryRun = function ({ args: { dryrun }, args, command }) {
  if (!dryrun || command === 'read') { return; }

  return dryRunByCommand[command]({ args });
};

// `delete` commands becomes read commands
const getDeleteReadCommand = function () {
  return { command: 'read' };
};

// `create` commands becomes read commands, that succeeds if an exception
// is thrown.
// TODO
const getCreateReadCommand = function ({ args: { newData } }) {
  return { response: { data: newData } };
};

// `replace` and `upsert` commands reuse `args.newData` as is
const useNewData = function ({ args: { newData } }) {
  return { response: { data: newData } };
};

const dryRunByCommand = {
  delete: getDeleteReadCommand,
  create: getCreateReadCommand,
  update: useNewData,
  upsert: useNewData,
};

module.exports = {
  applyDryRun,
};
