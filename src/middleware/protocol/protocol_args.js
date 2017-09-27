'use strict';

// Fill in `mInput.protocolArgs`, using protocol-specific headers.
// `protocolArgs` is later merged to `args`
const parseProtocolArgs = function ({ mInput, mInput: { protocolHandler } }) {
  const protocolArgs = protocolHandler.getArgs(mInput);
  return { protocolArgs };
};

module.exports = {
  parseProtocolArgs,
};
