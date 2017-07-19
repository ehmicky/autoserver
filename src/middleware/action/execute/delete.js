'use strict';

const { COMMANDS } = require('../../../constants');

/**
 * "delete" action uses a "delete" command
 **/
const deleteAction = async function (input) {
  const { args, action } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'delete' && multiple === isMultiple
  );

  const newArgs = Object.assign({}, args, { pagination: isMultiple });
  Object.assign(input, { command, args: newArgs });

  const response = await this.next(input);
  return response;
};

module.exports = {
  deleteAction,
};
