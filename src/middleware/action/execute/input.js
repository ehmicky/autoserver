'use strict';

const { omitBy } = require('../../../utilities');
const { COMMANDS } = require('../../../constants');

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
  const command = getCommand({ mInput, newInput });

  return { ...mInput, ...newInput, args, command };
};

const getNewInput = function ({
  mInput,
  formerResponse,
  commandDef: { mInput: getMInputFunc },
}) {
  return typeof getInputFunc === 'function'
    ? getMInputFunc(mInput, formerResponse)
    : getMInputFunc;
};

const getArgs = function ({ mInput, newInput, isLastCommand }) {
  const newInputArgs = {
    ...mInput.args,
    ...(newInput.args || {}),
    // All commands but last are considered 'internal'
    // E.g. authorization is not checked
    internal: !isLastCommand,
    // `args.data` should be transformed into `newData` and/or `currentData`
    data: undefined,
    // Those are only used temporarily
    commandType: undefined,
    commandMultiple: undefined,
  };
  // Specifying `undefined` allows removing specific arguments
  const newArgs = omitBy(newInputArgs, argValue => argValue === undefined);
  return newArgs;
};

// Actions only need to specify the command type
// The full command is retrieved by using `action.multiple`
const getCommand = function ({
  mInput: { action: { multiple: isMultiple } },
  newInput: { commandType = 'read', commandMultiple = isMultiple },
}) {
  const command = COMMANDS.find(({ type, multiple }) =>
    type === commandType && multiple === commandMultiple
  );
  return command;
};

module.exports = {
  getNextMInput,
};
