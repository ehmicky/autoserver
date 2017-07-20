'use strict';

const { reduceAsync, omitBy } = require('../../../utilities');
const { COMMANDS } = require('../../../constants');

// Fire all commands defined by a specific action
const fireAction = async function ({ input, action }) {
  const nextFunc = this.next.bind(this);
  const finalResponse = await reduceAsync(action, (
    formerResponse,
    commands,
  ) => fireCommands({
    nextFunc,
    input,
    formerResponse,
    commands,
  }), {});
  return finalResponse;
};

// Each command can be an array of commands, in which case they will be run
// concurrently, using the same input|formerResponse.
// The first of them will be used for final output
const fireCommands = async function ({
  nextFunc,
  input,
  formerResponse,
  commands,
}) {
  const commandsArray = Array.isArray(commands) ? commands : [commands];
  const promises = commandsArray.map(command =>
    fireCommand({ nextFunc, input, formerResponse, command })
  );
  const [firstResponse] = await Promise.all(promises);
  return firstResponse;
};

// Fire a single command
const fireCommand = async function ({
  nextFunc,
  input,
  formerResponse,
  command: {
    input: getInputFunc,
    test: testFunc,
  },
}) {
  const nextInput = getNextInput({ input, formerResponse, getInputFunc });

  const shouldFireCommand = testFireCommand({
    input: nextInput,
    formerResponse,
    testFunc,
  });
  if (!shouldFireCommand) { return formerResponse; }

  const response = await nextFunc(nextInput);
  return response;
};

const getNextInput = function ({ input, formerResponse, getInputFunc }) {
  const newInput = getNewInput({ input, formerResponse, getInputFunc });
  const args = getArgs({ input, newInput });
  const command = getCommand({ input, newInput });
  const nextInput = Object.assign({}, input, newInput, { args, command });
  return nextInput;
};

// Each command must specify its input
// `input` can be a function or the new input directly
// The response from the previous command is passed to `input` function,
// together with the general input
const getNewInput = function ({ input, formerResponse, getInputFunc }) {
  const inputInput = Object.assign({}, formerResponse, { input });
  const newInput = typeof getInputFunc === 'function'
    ? getInputFunc(inputInput)
    : getInputFunc;
  return newInput;
};

const getArgs = function ({ input, newInput }) {
  const newInputArgs = Object.assign(
    {},
    input.args,
    newInput.args,
    { data: undefined },
  );
  const newArgs = omitBy(newInputArgs, argValue => argValue === undefined);
  return newArgs;
};

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

const testFireCommand = function ({ input, formerResponse, testFunc }) {
  const testInput = Object.assign({}, formerResponse, { input });
  return !testFunc || testFunc(testInput);
};

module.exports = {
  fireAction,
};
