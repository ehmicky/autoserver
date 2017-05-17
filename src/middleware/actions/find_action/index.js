'use strict';


const { commands } = require('../../../constants');


/**
 * "find" action uses a "read" command
 **/
const findAction = async function () {
  return async function findAction(input) {
    if (input.actionType === 'find') {
      const isMultiple = input.action === 'findMany';
      const command = commands.find(({ type, multiple }) => {
        return type === 'read' && multiple === isMultiple;
      });
      Object.assign(input, { command });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  findAction,
};
