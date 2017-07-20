'use strict';

const { renameThis } = require('./rename_this');

/**
 * "delete" action uses a "delete" command
 **/
const deleteAction = async function (input) {
  const response = await renameThis.call(this, { input, actions });
  return response;
};

const getInput = function ({ input: { action: { multiple: isMultiple } } }) {
  return {
    command: 'delete',
    args: {
      pagination: isMultiple,
    },
  };
};

const actions = [
  {
    input: getInput,
  },
];

module.exports = {
  deleteAction,
};
