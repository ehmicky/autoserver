'use strict';


/**
 * "delete" action uses a "delete" dbCall
 **/
const deleteAction = async function () {
  return async function deleteAction(input) {
    if (input.actionType === 'delete') {
      input.dbCall = 'delete';
      input.dbCallFull = input.action === 'deleteOne'
        ? 'deleteOne'
        : 'deleteMany';
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  deleteAction,
};
