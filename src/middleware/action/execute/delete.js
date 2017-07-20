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

const getInput = function ({ input: { args, action } }) {
  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'delete' && multiple === isMultiple
  );

  const newArgs = Object.assign({}, args, { pagination: isMultiple });
  return { command, args: newArgs };
};

const actions = [
  {
    input: getInput,
  },
];

module.exports = {
  deleteAction,
};
