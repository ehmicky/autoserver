'use strict';

// Make write commands not change data, if argument `dryrun` is used
const applyDryrun = function ({ args: { dryrun }, args, command }) {
  if (!dryrun || command === 'find') { return; }

  const dryrunArg = dryrunByCommand[command]({ args });
  return { dryrun: dryrunArg };
};

// `delete` commands becomes `find` commands
const getDeleteFindCommand = function ({ args: { deletedIds } }) {
  const filter = { attrName: 'id', type: 'in', value: deletedIds };

  return { newInput: { command: 'find', filter } };
};

// `create` commands becomes `find` commands, that succeeds if an exception
// is thrown.
// TODO
const getCreateFindCommand = function () {
  return { noWrites: true };
};

// `replace` and `patch` commands reuse `args.newData` as is
const noWrites = function () {
  return { noWrites: true };
};

const dryrunByCommand = {
  delete: getDeleteFindCommand,
  create: getCreateFindCommand,
  replace: noWrites,
  patch: noWrites,
};

module.exports = {
  applyDryrun,
};
