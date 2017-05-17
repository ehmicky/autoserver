'use strict';


const { commands } = require('../../../constants');


/**
 * "delete" action uses a "delete" command
 **/
const deleteAction = async function () {
  return async function deleteAction(input) {
    if (input.action.type === 'delete') {
      const isMultiple = input.action.multiple;
      const command = commands.find(({ type, multiple }) => {
        return type === 'delete' && multiple === isMultiple;
      });
      Object.assign(input, { command });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  deleteAction,
};
