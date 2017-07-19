'use strict';

const { COMMANDS } = require('../../../../constants');
const { omit } = require('../../../../utilities');

// Retrieves the input for the "update" command
const getUpdateInput = function ({ input: { action, args }, data: models }) {
  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'update' && multiple === isMultiple
  );
  const currentData = isMultiple ? models : models[0];

  const newArgs = omit(args, ['data']);
  const newData = args.data;

  Object.assign(newArgs, { pagination: false, currentData, newData });
  return { command, args: newArgs };
};

module.exports = {
  getUpdateInput,
};
