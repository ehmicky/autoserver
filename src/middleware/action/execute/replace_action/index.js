'use strict';


const { commands } = require('../../../../constants');


/**
 * "replace" action uses an "update" command
 **/
const replaceAction = function () {
  return async function replaceAction(input) {
    const { sysArgs, action, log } = input;
    const perf = log.perf.start('replaceAction', 'middleware');

    const isMultiple = action.multiple;
    const command = commands.find(({ type, multiple }) => {
      return type === 'update' && multiple === isMultiple;
    });
    Object.assign(sysArgs, { pagination: false });
    Object.assign(input, { command, sysArgs });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  replaceAction,
};
