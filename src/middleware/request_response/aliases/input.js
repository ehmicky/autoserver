'use strict';

const { applyDataAliases } = require('./data');
const { applyOrderAliases } = require('./order');
const { applyTokenAliases } = require('./token');

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

const getTokens = function ({ args, attrName, aliases }) {
  return DIRECTIONS.reduce(
    (argsA, direction) =>
      getToken({ args: argsA, direction, attrName, aliases }),
    args,
  );
};

const DIRECTIONS = ['after', 'before'];

const getToken = function ({ args, direction, attrName, aliases }) {
  const token = args[direction];
  if (token === undefined || token === '') { return args; }

  const tokenA = applyTokenAliases({ token, attrName, aliases });
  return { ...args, [direction]: tokenA };
};

const modifiers = [
  getNewData,
  getOrder,
  getTokens,
];

module.exports = {
  applyInputAliases,
};
