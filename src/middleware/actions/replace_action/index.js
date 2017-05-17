'use strict';


/**
 * "replace" action uses an "update" command
 **/
const replaceAction = async function () {
  return async function replaceAction(input) {
    if (input.actionType === 'replace') {
      input.commandType = 'update';
      input.commandName = input.action === 'replaceOne'
        ? 'updateOne'
        : 'updateMany';
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  replaceAction,
};
