'use strict';

const { COMMANDS } = require('../../../constants');
const { omit } = require('../../../utilities');

/**
 * "create" action uses a "create" command
 **/
const createAction = async function (input) {
  const { action, args } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'create' && multiple === isMultiple
  );

  const newArgs = omit(args, ['data']);
  const newData = args.data;

  Object.assign(newArgs, { pagination: false, newData });
  Object.assign(input, { command, args: newArgs });

  const response = await this.next(input);
  return response;
};

module.exports = {
  createAction,
};
