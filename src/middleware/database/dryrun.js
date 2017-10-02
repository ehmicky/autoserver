'use strict';

// Make write commands not change data, if argument `dryrun` is used
const applyDryRun = function ({ args: { dryrun }, args, command }) {
  if (!dryrun || command === 'find') { return; }

  return dryRunByCommand[command]({ args });
};

// `delete` commands becomes `find` commands
const getDeleteFindCommand = function () {
  return { command: 'find' };
};

// `create` commands becomes `find` commands, that succeeds if an exception
// is thrown.
// TODO
const getCreateFindCommand = function ({ args: { newData } }) {
  return { response: { data: newData } };
};

// `replace` and `patch` commands reuse `args.newData` as is
const useNewData = function ({ args: { newData } }) {
  return { response: { data: newData } };
};

const dryRunByCommand = {
  delete: getDeleteFindCommand,
  create: getCreateFindCommand,
  replace: useNewData,
  patch: useNewData,
};

module.exports = {
  applyDryRun,
};
