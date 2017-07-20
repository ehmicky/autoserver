'use strict';

const { renameThis } = require('./rename_this');

/**
 * "create" action uses a "create" command
 **/
const createAction = async function (input) {
  const response = await renameThis.call(this, { input, actions });
  return response;
};

const getInput = function ({ input: { args: { data: argData } } }) {
  return {
    command: 'create',
    args: {
      pagination: false,
      newData: argData,
    },
  };
};

const actions = [
  {
    input: getInput,
  },
];

module.exports = {
  createAction,
};
