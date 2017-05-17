'use strict';


/**
 * "create" action uses a "create" command
 **/
const createAction = async function () {
  return async function createAction(input) {
    if (input.actionType === 'create') {
      input.commandType = 'create';
      input.commandName = input.action === 'createOne'
        ? 'createOne'
        : 'createMany';
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  createAction,
};
