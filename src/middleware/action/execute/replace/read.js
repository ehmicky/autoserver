'use strict';

// eslint-disable-next-line import/no-internal-modules
const { getFilter } = require('../upsert/filter');

// Retrieves the input for the "read" command
const getReadInput = function ({ input }) {
  const filter = getFilter({ input });
  const newArgs = { filter, pagination: false };
  return { command: 'read', args: newArgs };
};

module.exports = {
  getReadInput,
};
