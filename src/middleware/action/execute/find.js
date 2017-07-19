'use strict';

const { COMMANDS } = require('../../../constants');

/**
 * "find" action uses a "read" command
 **/
const findAction = async function (input) {
  const { args, action } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'read' && multiple === isMultiple
  );

  const newArgs = Object.assign({}, args, { pagination: isMultiple });
  Object.assign(input, { command, args: newArgs });

  const response = await this.next(input);
  return response;
};

module.exports = {
  findAction,
};
