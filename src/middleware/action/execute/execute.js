'use strict';

const { reduceAsync, omitBy } = require('../../../utilities');
const { COMMANDS } = require('../../../constants');

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

const fireCommand = async function ({
  nextFunc,
  input,
  input: {
    action: {
      multiple: isMultiple,
    },
  },
  formerResponse,
  command: {
    input: getNewInput,
    test: testFunc,
  },
}) {
  // Each command must specify its input
  // `input` can be a function or the new input directly
  const inputInput = Object.assign({}, formerResponse, { input });
  const newInput = typeof getNewInput === 'function'
    ? getNewInput(inputInput)
    : getNewInput;
  const newInputArgs = Object.assign(
    {},
    input.args,
    newInput.args,
    { data: undefined },
  );
  const newArgs = omitBy(newInputArgs, argValue => argValue === undefined);
  const { command: commandType = 'read' } = newInput;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === commandType && multiple === isMultiple
  );
  const nextInput = Object.assign(
    {},
    input,
    newInput,
    { args: newArgs, command },
  );

  const testInput = Object.assign({}, formerResponse, { input: nextInput });
  if (testFunc && !testFunc(testInput)) { return formerResponse; }

  const response = await nextFunc(nextInput);
  return response;
};

module.exports = {
  fireAction,
};
