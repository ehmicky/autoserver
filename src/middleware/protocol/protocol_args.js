'use strict';

const { mapValues, omitBy, deepMerge } = require('../../utilities');

// Fill in `mInput.topargs`, using protocol-specific headers.
// Also fill in `topargs.params` using `headers`.
const parseProtocolArgs = function ({
  mInput,
  protocolHandler,
  headers: { params },
}) {
  const protocolArgs = getProtocolArgs({ mInput, protocolHandler });
  const topargs = deepMerge({ params }, protocolArgs);
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
