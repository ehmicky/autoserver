'use strict';

const { mapValues, omitBy } = require('../../utilities');

// Fill in `mInput.protocolArgs`, using protocol-specific headers.
// `protocolArgs` is later merged to `args`
const parseProtocolArgs = function ({ mInput, protocolHandler }) {
  const topargs = getProtocolArgs({ mInput, protocolHandler });
  return { topargs };
};

// Protocol-specific arguments
const getProtocolArgs = function ({ mInput, protocolHandler: { args } }) {
  const argsA = mapValues(args, arg => arg(mInput));
  const argsB = omitBy(argsA, value => value === undefined);
  return argsB;
};

module.exports = {
  parseProtocolArgs,
};
