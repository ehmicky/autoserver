'use strict';

const { COMMANDS } = require('../../../../constants');
// eslint-disable-next-line import/no-internal-modules
const { getFilter } = require('../upsert/filter');

// Retrieves the input for the "read" command
const getReadInput = function ({ input, input: { action } }) {
  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'read' && multiple === isMultiple
  );

  const filter = getFilter({ input });
  const newArgs = { filter, pagination: false };
  return { command, args: newArgs };
};

module.exports = {
  getReadInput,
};
