'use strict';


const { commands } = require('../../../../constants');


/**
 * "delete" action uses a "delete" command
 **/
const deleteAction = function () {
  return async function deleteAction(input) {
    const { args, action, log } = input;
    const perf = log.perf.start('action.delete', 'middleware');

    const isMultiple = action.multiple;
    const command = commands.find(({ type, multiple }) => {
      return type === 'delete' && multiple === isMultiple;
    });

    const newArgs = Object.assign({}, args, { pagination: isMultiple });
    Object.assign(input, { command, args: newArgs });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  deleteAction,
};
