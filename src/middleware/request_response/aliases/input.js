'use strict';

const { applyDataAliases } = require('./data');
const { applyOrderAliases } = require('./order');

// Apply `alias` in server input
const applyInputAliases = function ({ args, modelAliases }) {
  const argsB = Object.entries(modelAliases).reduce(
    (argsA, [attrName, aliases]) =>
      applyInputAlias({ args: argsA, attrName, aliases }),
    args,
  );
  return { args: argsB };
};

const applyInputAlias = function ({ args = {}, attrName, aliases }) {
  return modifiers.reduce(
    (argsA, modifier) => modifier({ args: argsA, attrName, aliases }),
    args,
  );
};

const getNewData = function ({
  args,
  args: { newData, currentData },
  attrName,
  aliases,
}) {
  if (!newData) { return args; }

  const newDataA = applyDataAliases({
    newData,
    currentData,
    attrName,
    aliases,
  });
  return { ...args, newData: newDataA };
};

const getOrder = function ({ args, args: { order }, attrName, aliases }) {
  if (!order) { return args; }

  const orderA = applyOrderAliases({ order, attrName, aliases });
  return { ...args, order: orderA };
};

const modifiers = [
  getNewData,
  getOrder,
];

module.exports = {
  applyInputAliases,
};
