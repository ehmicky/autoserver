'use strict';

const { omitBy } = require('../../../utilities');
const { COMMANDS } = require('../../../constants');

// Each command must specify its input
// `input` can be a function or the new input directly
// The response from the previous command is passed to `input` function,
// together with the general input
const getNextInput = function ({
  input,
  formerResponse,
  commandDef,
  isLastCommand,
}) {
  const newInput = getNewInput({ input, formerResponse, commandDef });
  const args = getArgs({ input, newInput, isLastCommand });
  const command = getCommand({ input, newInput });

  return { ...input, ...newInput, args, command };
};

const getNewInput = function ({
  input,
  formerResponse,
  commandDef: { input: getInputFunc },
}) {
  return typeof getInputFunc === 'function'
    ? getInputFunc(input, formerResponse)
    : getInputFunc;
};

const getArgs = function ({ input, newInput, isLastCommand }) {
  const newInputArgs = {
    ...input.args,
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
  input: { action: { multiple: isMultiple } },
  newInput: { commandType = 'read', commandMultiple = isMultiple },
}) {
  const command = COMMANDS.find(({ type, multiple }) =>
    type === commandType && multiple === commandMultiple
  );
  return command;
};

module.exports = {
  getNextInput,
};
