'use strict';


const { commands } = require('../../../../constants');


/**
 * "find" action uses a "read" command
 **/
const findAction = function () {
  return async function findAction(input) {
    const { args, action, log } = input;
    const perf = log.perf.start('action.find', 'middleware');

    const isMultiple = action.multiple;
    const command = commands.find(({ type, multiple }) => {
      return type === 'read' && multiple === isMultiple;
    });

    const newArgs = Object.assign({}, args, { pagination: isMultiple });
    Object.assign(input, { command, args: newArgs });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  findAction,
};
