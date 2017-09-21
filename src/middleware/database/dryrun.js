'use strict';

const { orderBy: orderByFunc, map } = require('lodash');

// Make write commands not change data, if settings `dryrun` is used
const applyDryRun = function ({ settings: { dryrun }, args, command }) {
  if (!dryrun || command === 'read') { return; }

  return dryRunByCommand[command]({ args });
};

// `delete` commands becomes read commands
const getReadCommand = function () {
  return { command: 'read' };
};

// `replace`, `create` and `upsert` commands reuse `args.newData` as is
const useNewData = function ({ args: { newData: data, orderBy } }) {
  const dataA = sortData({ data, orderBy });
  return { response: { data: dataA } };
};

// This is usually done by the database
const sortData = function ({ data, orderBy }) {
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
