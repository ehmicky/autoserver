'use strict';

const { reduceAsync, omitBy } = require('../../../utilities');
const { COMMANDS } = require('../../../constants');

const renameThis = async function ({ input, actions: allActions }) {
  const nextFunc = this.next.bind(this);
  const finalResponse = await reduceAsync(allActions, (
    formerResponse,
    actions,
  ) => fireActions({
    nextFunc,
    input,
    formerResponse,
    actions,
  }), {});
  return finalResponse;
};

// Each action can be an array of actions, in which case they will be run
// concurrently, using the same input|formerResponse.
// The first of them will be used for final output
const fireActions = async function ({
  nextFunc,
  input,
  formerResponse,
  actions,
}) {
  const actionsArray = Array.isArray(actions) ? actions : [actions];
  const promises = actionsArray.map(action =>
    fireAction({ nextFunc, input, formerResponse, action })
  );
  const [firstResponse] = await Promise.all(promises);
  return firstResponse;
};

const fireAction = async function ({
  nextFunc,
  input,
  input: {
    action: {
      multiple: isMultiple,
    },
  },
  formerResponse,
  action: {
    input: getNewInput,
    test: testFunc,
  },
}) {
  // Each action must specify its input
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
  renameThis,
};
