'use strict';

// Make write commands not change data, if argument `dryrun` is used
// `noQuery` is a flag indicating no database query should be performed.
const applyDryrun = function ({ args, args: { dryrun }, command }) {
  if (!dryrun || command === 'find') { return; }

  return dryrunByCommand[command]({ args });
};

// `delete` commands becomes `find` commands
const getDeleteFindCommand = function ({ args, args: { deletedIds } }) {
  const filter = { attrName: 'id', type: 'in', value: deletedIds };

  return { command: 'find', args: { ...args, filter } };
};

// `create` commands becomes `find` commands, that succeeds if an exception
// is thrown.
// TODO
const getCreateFindCommand = function () {
  return { noQuery: true };
};

// `replace` and `patch` commands reuse `args.newData` as is
const noWrites = function () {
  return { noQuery: true };
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
