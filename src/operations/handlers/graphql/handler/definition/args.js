'use strict';

const { throwError } = require('../../../../../error');
const { assignObject, mapValues } = require('../../../../../utilities');

// Parse GraphQL arguments, for each possible argument type
const parseArgs = function ({
  mainSelection: { arguments: fields },
  variables,
}) {
  validateArgs(fields);

  return parseObject({ fields, variables });
};

const parseObject = function ({ fields: args, variables }) {
  if (!args || args.length === 0) { return {}; }

  validateArgs(args);

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

const validateArgs = function (fields) {
  const names = fields.map(({ name }) => name && name.value);
  const duplicateName = names
    .find((name, index) => names.slice(index + 1).includes(name));

  // GraphQL spec 5.3.2 'Argument Uniqueness'
  // And GraphQL spec 5.5.1 'Input Object Field Uniqueness'
  if (duplicateName !== undefined) {
    const message = `Cannot specify argument '${duplicateName}' twice`;
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }
};

module.exports = {
  parseArgs,
};
