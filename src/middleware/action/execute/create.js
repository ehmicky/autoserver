'use strict';

const { COMMANDS } = require('../../../constants');
const { omit } = require('../../../utilities');

const { renameThis } = require('./rename_this');

/**
 * "create" action uses a "create" command
 **/
const createAction = async function (input) {
  const response = await renameThis.call(this, { input, actions });
  return response;
};

const getInput = function ({ input: { action, args } }) {
  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'create' && multiple === isMultiple
  );

  const newArgs = omit(args, ['data']);
  const newData = args.data;

  Object.assign(newArgs, { pagination: false, newData });
  return { command, args: newArgs };
};

const actions = [
  {
    input: getInput,
  },
];

module.exports = {
  createAction,
};
