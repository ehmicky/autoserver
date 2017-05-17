'use strict';


/**
 * "replace" action uses an "update" dbCall
 **/
const replaceAction = async function () {
  return async function replaceAction(input) {
    if (input.actionType === 'replace') {
      input.dbCall = 'update';
      input.dbCallFull = input.action === 'replaceOne'
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
