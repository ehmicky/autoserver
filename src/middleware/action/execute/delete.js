'use strict';

const { COMMANDS } = require('../../../constants');

const { renameThis } = require('./rename_this');

/**
 * "delete" action uses a "delete" command
 **/
const deleteAction = async function (input) {
  const response = await renameThis.call(this, { input, actions });
  return response;
};

const getInput = function ({ input }) {
  const { args, action } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'delete' && multiple === isMultiple
  );

  const newArgs = Object.assign({}, args, { pagination: isMultiple });
  Object.assign(input, { command, args: newArgs });

  return input;
};

const actions = [
  {
    getArgs: getInput,
  },
];

module.exports = {
  deleteAction,
};
