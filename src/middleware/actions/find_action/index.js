'use strict';


/**
 * "find" action uses a "read" command
 **/
const findAction = async function () {
  return async function findAction(input) {
    if (input.actionType === 'find') {
      input.commandType = 'read';
      input.commandName = input.action === 'findOne'
        ? 'readOne'
        : 'readMany';
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  findAction,
};
