'use strict';


const { commands } = require('../../../../constants');


/**
 * "create" action uses a "create" command
 **/
const createAction = function () {
  return async function createAction(input) {
    const { sysArgs, action, log } = input;
    const perf = log.perf.start('action.create', 'middleware');

    const isMultiple = action.multiple;
    const command = commands.find(({ type, multiple }) => {
      return type === 'create' && multiple === isMultiple;
    });
    Object.assign(sysArgs, { pagination: false });
    Object.assign(input, { command, sysArgs });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  createAction,
};
