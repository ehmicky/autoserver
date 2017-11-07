'use strict';

const {
  transtype,
  set,
  mapValues,
  omitBy,
  deepMerge,
} = require('../../utilities');

// Fill in `mInput.topargs`, using protocol-agnostic and
// protocol-specific headers.
const parseProtocolArgs = function ({
  mInput,
  protocolHandler,
  requestheaders,
}) {
  const genericArgs = getGenericArgs({ requestheaders });
  const protocolArgs = getProtocolArgs({ mInput, protocolHandler });
  const topargs = deepMerge(genericArgs, protocolArgs);
  return { topargs };
};

// Protocol-agnostic headers
const getGenericArgs = function ({ requestheaders }) {
  const genericArgs = Object.entries(requestheaders)
    .filter(([name]) => ARGS_REGEXP.test(name))
    .map(([name, value]) => getGenericArg({ name, value }));
  const genericArgsA = deepMerge(...genericArgs);
  return genericArgsA;
};

const getGenericArg = function ({ name, value }) {
  // E.g. X-Apiengine-Var-Example: 5 will be parsed as `{ var: { example: 5 } }`
  // Arguments generally should not use any delimiter like _ - . and should
  // be lowercase
  const path = name
    .replace(ARGS_REGEXP, '$2')
    .toLowerCase()
    .split('-')
    // Transtype array indexes to number, e.g. X-Apiengine-Var-0: 5 will be
    // parsed as `{ var: [5] }`
    .map(transtype);
  const valueA = transtype(value);
  const genericArg = set({}, path, valueA);
  return genericArg;
};

// Headers starting X-Apiengine-ARG, e.g. X-Apiengine-Filter for `args.filter`
const ARGS_REGEXP = /^(x-apiengine-)(.+)$/;

// Protocol-specific arguments
const getProtocolArgs = function ({ mInput, protocolHandler: { args } }) {
  const argsA = mapValues(args, arg => arg(mInput));
  const argsB = omitBy(argsA, value => value === undefined);
  return argsB;
};

module.exports = {
  parseProtocolArgs,
};
