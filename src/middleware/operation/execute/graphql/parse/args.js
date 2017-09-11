'use strict';

const { assignObject, mapValues } = require('../../../../../utilities');

const parseObject = function ({ fields: args, variables }) {
  if (!args || args.length === 0) { return {}; }

  const argsA = args
    .map(arg => ({ [arg.name.value]: arg }))
    .reduce(assignObject, {});
  const argsB = mapValues(
    argsA,
    ({ value: arg }) => argParsers[arg.kind]({ ...arg, variables })
  );
  return argsB;
};

const parseArray = function ({ values, variables }) {
  return values.map(arg => argParsers[arg.kind]({ ...arg, variables }));
};

const parseNumber = function ({ value }) {
  return Number(value);
};

const parseAsIs = function ({ value }) {
  return value;
};

const parseVariable = function ({ name, variables }) {
  return variables[name.value];
};

const argParsers = {
  ObjectValue: parseObject,
  ListValue: parseArray,
  IntValue: parseNumber,
  FloatValue: parseNumber,
  StringValue: parseAsIs,
  BooleanValue: parseAsIs,
  EnumValue: parseAsIs,
  Variable: parseVariable,
};

module.exports = {
  parseObject,
};
