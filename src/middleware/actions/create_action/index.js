'use strict';


/**
 * "create" action uses a "create" dbCall
 **/
const createAction = async function () {
  return async function createAction(input) {
    if (input.actionType === 'create') {
      input.dbCall = 'create';
      input.dbCallFull = input.action === 'createOne'
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
