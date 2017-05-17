'use strict';


const { commands } = require('../../../constants');


/**
 * "create" action uses a "create" command
 **/
const createAction = async function () {
  return async function createAction(input) {
    const { sysArgs = {}, action } = input;

    if (action.type === 'create') {
      const isMultiple = action.multiple;
      const command = commands.find(({ type, multiple }) => {
        return type === 'create' && multiple === isMultiple;
      });
      Object.assign(sysArgs, { pagination: false });
      Object.assign(input, { command, sysArgs });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  createAction,
};
