'use strict';


/**
 * "delete" action uses a "delete" command
 **/
const deleteAction = async function () {
  return async function deleteAction(input) {
    if (input.actionType === 'delete') {
      input.commandType = 'delete';
      input.commandName = input.action === 'deleteOne'
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
