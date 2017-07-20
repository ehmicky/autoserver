'use strict';

const { renameThis } = require('./rename_this');

/**
 * "find" action uses a "read" command
 **/
const findAction = async function (input) {
  const response = await renameThis.call(this, { input, actions });
  return response;
};

const getInput = function ({ input: { args, action } }) {
  const pagination = action.multiple;
  const newArgs = Object.assign({}, args, { pagination });
  return {
    command: 'read',
    args: newArgs,
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
