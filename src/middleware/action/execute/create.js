'use strict';

const { omit } = require('../../../utilities');

const { renameThis } = require('./rename_this');

/**
 * "create" action uses a "create" command
 **/
const createAction = async function (input) {
  const response = await renameThis.call(this, { input, actions });
  return response;
};

const getInput = function ({ input: { args } }) {
  const newArgs = omit(args, ['data']);
  const newData = args.data;

  Object.assign(newArgs, { pagination: false, newData });
  return { command: 'create', args: newArgs };
};

const actions = [
  {
    input: getInput,
  },
];

module.exports = {
  createAction,
};
