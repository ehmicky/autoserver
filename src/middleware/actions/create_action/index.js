'use strict';


const { commands } = require('../../../constants');


/**
 * "create" action uses a "create" command
 **/
const createAction = async function () {
  return async function createAction(input) {
    if (input.action.type === 'create') {
      const isMultiple = input.action.multiple;
      const command = commands.find(({ type, multiple }) => {
        return type === 'create' && multiple === isMultiple;
      });
      Object.assign(input, { command });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  createAction,
};
