'use strict';

const { throwError } = require('../../../../../errors');
const { mapValues } = require('../../../../../utilities');
const { validateDuplicates } = require('../duplicates');

// Parse GraphQL arguments, for each possible argument type
const parseArgs = function ({
  mainSelection: { arguments: fields },
  variables,
}) {
  // GraphQL spec 5.3.2 'Argument Uniqueness'
  validateDuplicates({ nodes: fields, type: 'arguments' });

  return parseObject({ fields, variables });
};

const parseObject = function ({ fields: args, variables }) {
  if (!args || args.length === 0) { return {}; }

  // And GraphQL spec 5.5.1 'Input Object Field Uniqueness'
  validateDuplicates({ nodes: args, type: 'arguments' });

  const argsA = args.map(arg => ({ [arg.name.value]: arg }));
  const argsB = Object.assign({}, ...argsA);
  const argsC = mapValues(
    argsB,
    ({ value: arg }) => argParsers[arg.kind]({ ...arg, variables })
  );
  return argsC;
};

const parseArray = function ({ values, variables }) {
  return values.map(arg => argParsers[arg.kind]({ ...arg, variables }));
};

const parseNumber = function ({ value }) {
  return Number(value);
};

// The only enum value we support is undefined, which is the same as null
const parseEnum = function ({ value }) {
  if (value !== 'undefined') {
    const message = `'${value}' is an unknown constant`;
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }

  return null;
};

const parseNull = function () {
  return null;
};

const parseAsIs = function ({ value }) {
  return value;
};

const parseVariable = function ({ name, variables }) {
  return variables && variables[name.value];
};

const argParsers = {
  ObjectValue: parseObject,
  ListValue: parseArray,
  IntValue: parseNumber,
  FloatValue: parseNumber,
  EnumValue: parseEnum,
  NullValue: parseNull,
  StringValue: parseAsIs,
  BooleanValue: parseAsIs,
  Variable: parseVariable,
};

module.exports = {
  parseArgs,
};
