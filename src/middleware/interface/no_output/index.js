'use strict';


const { EngineError } = require('../../../error');


// Sets modifiers.noOutput, by using args.no_output
// It only flags that part of the response is to be removed,
// but it's up to the main interface middleware to actually remove it
const noOutputSet = function () {
  return async function noOutputSet(input) {
    const { log } = input;
    const perf = log.perf.start('interface.noOutputSet', 'middleware');

    const flaggedAction = flagNoOutput(input);

    perf.stop();
    const response = await this.next(input);

    if (flaggedAction) {
      response.modifiers.noOutput = flaggedAction;
    }

    return response;
  };
};

const flagNoOutput = function ({
  protocolArgs: { noOutput: generalNoOutput },
  args,
  fullAction,
  action,
}) {
  let noOutput = generalNoOutput !== undefined
    ? generalNoOutput
    : args.no_output;

  if (noOutput === undefined) {
    if (action.type !== 'delete') { return; }

    // Delete actions use no_output by default
    noOutput = true;
  }

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
