'use strict';


const { EngineError } = require('../../../error');


// Sets modifiers.noOutput, by using args.no_output
// It only flags that part of the response is to be removed,
// but it's up to the main interface middleware to actually remove it
const noOutputSet = function () {
  return async function noOutputSet(input) {
    const flaggedAction = flagNoOutput(input);

    const response = await this.next(input);

    if (flaggedAction) {
      response.modifiers.noOutput = flaggedAction;
    }

    return response;
  };
};

const flagNoOutput = function ({ args, fullAction }) {
  const { no_output: noOutput } = args;

  if (noOutput === undefined) { return; }

  // Do not pass args.no_output to next layers
  delete args.no_output;

  if (noOutput === false) { return; }

  if (typeof noOutput !== 'boolean') {
    const message = `Wrong parameters: 'no_output' must be true of false, not '${noOutput}'`;
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }

  return fullAction;
};


module.exports = {
  noOutputSet,
};
