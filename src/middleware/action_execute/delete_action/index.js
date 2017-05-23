'use strict';


const { commands } = require('../../../constants');


/**
 * "delete" action uses a "delete" command
 **/
const deleteAction = function () {
  return async function deleteAction(input) {
    const { sysArgs, action } = input;

    const isMultiple = action.multiple;
    const command = commands.find(({ type, multiple }) => {
      return type === 'delete' && multiple === isMultiple;
    });
    Object.assign(sysArgs, { pagination: isMultiple });
    Object.assign(input, { command, sysArgs });

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  deleteAction,
};
