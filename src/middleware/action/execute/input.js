'use strict';

const { omitBy } = require('../../../utilities');
const { COMMANDS } = require('../../../constants');

// Each command must specify its input
// `input` can be a function or the new input directly
// The response from the previous command is passed to `input` function,
// together with the general input
const getNextInput = function ({ input, formerResponse, commandDef }) {
  const newInput = getNewInput({ input, formerResponse, commandDef });
  const args = getArgs({ input, newInput });
  const command = getCommand({ input, newInput });

  const nextInput = Object.assign({}, input, newInput, { args, command });
  return nextInput;
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

const getArgs = function ({ input, newInput }) {
  const newInputArgs = Object.assign(
    {},
    input.args,
    newInput.args,
    // `args.data` should be transformed into `newData` and/or `currentData`
    { data: undefined },
  );
  // Specifying `undefined` allows removing specific arguments
  const newArgs = omitBy(newInputArgs, argValue => argValue === undefined);
  return newArgs;
};

// Actions only need to specify the command type
// The full command is retrieved by using `action.multiple`
const getCommand = function ({
  input: { action: { multiple: isMultiple } },
  newInput,
}) {
  const { command: commandType = 'read' } = newInput;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === commandType && multiple === isMultiple
  );
  return command;
};

module.exports = {
  getNextInput,
};
