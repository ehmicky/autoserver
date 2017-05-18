'use strict';


const { commands } = require('../../../constants');


/**
 * "find" action uses a "read" command
 **/
const findAction = function () {
  return async function findAction(input) {
    const { sysArgs, action } = input;

    if (action.type === 'find') {
      const isMultiple = action.multiple;
      const command = commands.find(({ type, multiple }) => {
        return type === 'read' && multiple === isMultiple;
      });
      Object.assign(sysArgs, { pagination: isMultiple });
      Object.assign(input, { command, sysArgs });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  findAction,
};
