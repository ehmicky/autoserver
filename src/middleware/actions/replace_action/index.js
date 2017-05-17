'use strict';


const { commands } = require('../../../constants');


/**
 * "replace" action uses an "update" command
 **/
const replaceAction = async function () {
  return async function replaceAction(input) {
    if (input.actionType === 'replace') {
      const isMultiple = input.action === 'replaceMany';
      const command = commands.find(({ type, multiple }) => {
        return type === 'update' && multiple === isMultiple;
      });
      Object.assign(input, { command });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  replaceAction,
};
