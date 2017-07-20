'use strict';

const { renameThis } = require('./rename_this');

/**
 * "delete" action uses a "delete" command
 **/
const deleteAction = async function (input) {
  const response = await renameThis.call(this, { input, actions });
  return response;
};

const getInput = function ({ input: { args, action } }) {
  const pagination = action.multiple;
  const newArgs = Object.assign({}, args, { pagination });
  return { command: 'delete', args: newArgs };
};

const actions = [
  {
    input: getInput,
  },
];

module.exports = {
  deleteAction,
};
