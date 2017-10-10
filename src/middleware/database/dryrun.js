'use strict';

// Make write commands not change data, if argument `dryrun` is used
const applyDryrun = function ({ args: { dryrun }, args, command }) {
  if (!dryrun || command === 'find') { return; }

  return dryrunByCommand[command]({ args });
};

// `delete` commands becomes `find` commands
const getDeleteFindCommand = function ({ args: { deletedIds, ...args } }) {
  const filter = { attrName: 'id', type: 'in', value: deletedIds };

  return {
    command: 'find',
    args: { ...args, filter },
  };
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

const dryrunByCommand = {
  delete: getDeleteFindCommand,
  create: getCreateFindCommand,
  replace: useNewData,
  patch: useNewData,
};

module.exports = {
  applyDryrun,
};
