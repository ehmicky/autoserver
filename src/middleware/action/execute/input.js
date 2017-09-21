'use strict';

const { omitBy, omit } = require('../../../utilities');

// Each command must specify its mInput
// `mInput` can be a function or the new mInput directly
// The response from the previous command is passed to `mInput` function,
// together with the general mInput
const getNextMInput = function ({
  mInput,
  formerResponse,
  commandDef,
  isLastCommand,
}) {
  const newInput = getNewInput({ mInput, formerResponse, commandDef });
  const args = getArgs({ mInput, newInput, isLastCommand });

  return { ...mInput, ...newInput, args };
};

const getNewInput = function ({
  mInput,
  formerResponse,
  commandDef: { mInput: getMInputFunc },
}) {
  return typeof getMInputFunc === 'function'
    ? getMInputFunc(mInput, formerResponse)
    : getMInputFunc;
};

const getArgs = function ({ mInput, newInput, isLastCommand }) {
  const args = {
    ...mInput.args,
    ...(newInput.args || {}),
    // All commands but last are considered 'internal'
    // E.g. authorization is not checked
    internal: !isLastCommand,
  };
  // `args.data` should be transformed into `newData` and/or `currentData`
  const argsA = omit(args, 'data');
  // Specifying `undefined` allows removing specific arguments
  const argsB = omitBy(argsA, argValue => argValue === undefined);
  return argsB;
};

module.exports = {
  getNextMInput,
};
