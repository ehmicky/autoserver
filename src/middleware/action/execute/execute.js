'use strict';

const { reduceAsync } = require('../../../utilities');

const { getNextInput } = require('./input');

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

  const testInput = Object.assign({}, formerResponse, { input });
  const shouldFireCommand = !testFunc || testFunc(testInput);
  if (!shouldFireCommand) { return formerResponse; }

  const response = await nextFunc(nextInput);
  return response;
};

module.exports = {
  fireAction,
};
