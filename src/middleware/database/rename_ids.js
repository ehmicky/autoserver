'use strict';

const { omit } = require('../../utilities');
const { mapNodes } = require('../../filter');

// Some databases require a specific name for `id`, e.g. `_id` for MongoDB.
// This is a translation layer that modifies `id` name inside and outside of
// the database adapter.
const renameIdsInput = function ({ dbAdapter: { idName }, args }) {
  // Database adapter declare optional `id` name with `idName`
  if (idName === undefined) { return { args }; }

  const argsA = Object.entries(idsInput)
    .reduce(reduceArgs.bind(null, idName), args);
  return { args: argsA };
};

const reduceArgs = function (idName, args, [argName, func]) {
  const { [argName]: arg } = args;
  if (arg === undefined) { return args; }

  const argA = func(arg, idName);
  return { ...args, [argName]: argA };
};

// Modify `args.newData`, or database output
const renameData = function (data, idName, oldIdName = 'id') {
  return data.map(datum => renameDatum({ datum, idName, oldIdName }));
};

const renameDatum = function ({ datum, idName, oldIdName }) {
  const hasId = Object.keys(datum).includes(oldIdName);
  if (!hasId) { return datum; }

  const { [oldIdName]: attr } = datum;
  const datumA = omit(datum, oldIdName);
  return { ...datumA, [idName]: attr };
};

// Modify `args.filter`
const renameFilter = function (filter, idName) {
  return mapNodes(filter, node => renameFilterId({ node, idName }));
};

const renameFilterId = function ({ node, idName }) {
  if (node.attrName !== 'id') { return node; }

  return { ...node, attrName: idName };
};

// Modify `args.order`
const renameOrder = function (order, idName) {
  return order.map(part => renameOrderPart({ part, idName }));
};

const renameOrderPart = function ({ part, part: { attrName }, idName }) {
  if (attrName !== 'id') { return part; }

  return { ...part, attrName: idName };
};

const idsInput = {
  newData: renameData,
  filter: renameFilter,
  order: renameOrder,
};

// Modify database output
const renameIdsOutput = function ({ dbAdapter: { idName }, dbData, command }) {
  const shouldRename = command === 'find' &&
    idName !== undefined &&
    dbData !== undefined;
  if (!shouldRename) { return { dbData }; }

  // Inverse of `args.newData` transformation
  const dbDataA = renameData(dbData, 'id', idName);
  return { dbData: dbDataA };
};

module.exports = {
  renameIdsInput,
  renameIdsOutput,
};
