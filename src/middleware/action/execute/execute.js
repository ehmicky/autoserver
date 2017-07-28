'use strict';

const { reduceAsync } = require('../../../utilities');

const { getNextInput } = require('./input');

// Fire all commands defined by a specific action
const fireAction = async function ({ input, action, nextFunc }) {
  const finalResponse = await reduceAsync(
    action,
    (formerResponse, commands, index) => {
      const isLastCommand = index === action.length - 1;
      return fireCommands({
        nextFunc,
        input,
        formerResponse,
        commands,
        isLastCommand,
      });
    },
    {},
  );
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
  isLastCommand,
}) {
  const commandsArray = Array.isArray(commands) ? commands : [commands];
  const promises = commandsArray.map(commandDef =>
    fireCommand({ nextFunc, input, formerResponse, commandDef, isLastCommand })
  );
  const [firstResponse] = await Promise.all(promises);
  return firstResponse;
};

// Fire a single command
const fireCommand = async function ({
  nextFunc,
  input,
  formerResponse,
  commandDef,
  commandDef: { test: testFunc },
  isLastCommand,
}) {
  const inputA = getNextInput({
    input,
    formerResponse,
    commandDef,
    isLastCommand,
  });

  // Can add a test function to fire commands conditionally
  const shouldFireCommand = !testFunc || testFunc(input, formerResponse);
  if (!shouldFireCommand) { return formerResponse; }

  const response = await nextFunc(inputA);
  return response;
};

module.exports = {
  fireAction,
};
