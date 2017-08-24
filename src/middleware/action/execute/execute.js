'use strict';

const { reduceAsync } = require('../../../utilities');

const { getNextMInput } = require('./input');

// Fire all commands defined by a specific action
const fireAction = function ({ mInput, action, nextLayer }) {
  return reduceAsync(
    action,
    (formerInput, commands, index) => {
      const isLastCommand = index === action.length - 1;
      return fireCommands({
        nextLayer,
        mInput,
        formerInput,
        commands,
        isLastCommand,
      });
    },
    {},
  );
};

// Each command can be an array of commands, in which case they will be run
// concurrently, using the same mInput|formerResponse.
// The first of them will be used for final output
const fireCommands = async function ({
  nextLayer,
  mInput,
  formerInput: { response: formerResponse },
  commands,
  isLastCommand,
}) {
  const commandsArray = Array.isArray(commands) ? commands : [commands];
  const promises = commandsArray.map(commandDef => fireCommand({
    nextLayer,
    mInput,
    formerResponse,
    commandDef,
    isLastCommand,
  }));
  const [firstInput] = await Promise.all(promises);
  return firstInput;
};

// Fire a single command
const fireCommand = function ({
  nextLayer,
  mInput,
  formerResponse,
  commandDef,
  commandDef: { test: testFunc },
  isLastCommand,
}) {
  const mInputA = getNextMInput({
    mInput,
    formerResponse,
    commandDef,
    isLastCommand,
  });

  // Can add a test function to fire commands conditionally
  const shouldFireCommand = !testFunc || testFunc(mInput, formerResponse);
  if (!shouldFireCommand) { return formerResponse; }

  return nextLayer(mInputA);
};

module.exports = {
  fireAction,
};
