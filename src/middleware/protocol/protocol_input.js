'use strict';

const { set } = require('../../utilities');

// Fill in protocol-specific `mInput`
const parseProtocolInput = function ({ mInput, protocolHandler: { input } }) {
  const mInputA = Object.entries(input).reduce(reduceProtocolInput, mInput);
  return mInputA;
};

const reduceProtocolInput = function (mInput, [name, func]) {
  const value = func(mInput);
  if (value === undefined) { return mInput; }

  const mInputA = set(mInput, name.split('.'), value);
  return mInputA;
};

module.exports = {
  parseProtocolInput,
};
