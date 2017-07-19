'use strict';

const { COMMANDS } = require('../../../constants');

const { renameThis } = require('./rename_this');

/**
 * "find" action uses a "read" command
 **/
const findAction = async function (input) {
  const response = await renameThis.call(this, { input, actions });
  return response;
};

const getInput = function ({ input: { args, action } }) {
  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'read' && multiple === isMultiple
  );

  const newArgs = Object.assign({}, args, { pagination: isMultiple });
  return { command, args: newArgs };
};

const actions = [
  {
    getArgs: getInput,
  },
];

module.exports = {
  findAction,
};
