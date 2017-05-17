'use strict';


/**
 * "find" action uses a "read" dbCall
 **/
const findAction = async function () {
  return async function findAction(input) {
    if (input.actionType === 'find') {
      input.dbCall = 'read';
      input.dbCallFull = input.action === 'findOne'
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
