'use strict';

// eslint-disable-next-line import/no-internal-modules
const { getFilter } = require('../upsert/filter');

// Retrieves the input for the "read" command
const getReadInput = function ({ input }) {
  return {
    command: 'read',
    args: {
      filter: getFilter({ input }),
      pagination: false,
    },
  };
};

module.exports = {
  getReadInput,
};
