'use strict';

const { COMMANDS } = require('../../../../constants');
const { pick } = require('../../../../utilities');

// Retrieves the input for the "read" command
const getReadInput = function ({ input: { args, action } }) {
  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'read' && multiple === isMultiple
  );

  const newArgs = pick(args, ['filter']);
  Object.assign(newArgs, { pagination: false });
  return { command, args: newArgs };
};

module.exports = {
  getReadInput,
};
