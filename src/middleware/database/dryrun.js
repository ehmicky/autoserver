'use strict';

const { orderBy: orderByFunc, map } = require('lodash');

const { COMMANDS } = require('../../constants');

// Make write commands not change data, if settings `dryrun` is used
const applyDryRun = function ({ settings: { dryrun }, args, command }) {
  if (!dryrun || command.type === 'read') { return; }

  return dryRunByCommand[command.type]({ args, command });
};

// `delete` commands becomes read commands
const getReadCommand = function ({ command }) {
  const commandA = COMMANDS.find(
    ({ type, multiple }) => type === 'read' && multiple === command.multiple,
  );
  return { command: commandA };
};

// `replace`, `create` and `upsert` commands reuse `args.newData` as is
const useNewData = function ({ command, args: { newData: data, orderBy } }) {
  const dataA = sortData({ command, data, orderBy });
  return { response: { data: dataA } };
};

// This is usually done by the database
const sortData = function ({ command, data, orderBy }) {
  if (!command.multiple) { return data; }

  return orderByFunc(data, map(orderBy, 'attrName'), map(orderBy, 'order'));
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
