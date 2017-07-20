'use strict';

const { renameThis } = require('./rename_this');

/**
 * "find" action uses a "read" command
 **/
const findAction = async function (input) {
  const response = await renameThis.call(this, { input, actions });
  return response;
};

const getInput = function ({ input: { action: { multiple: isMultiple } } }) {
  return {
    command: 'read',
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
  findAction,
};
