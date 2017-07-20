'use strict';

const { getCreateModels } = require('./split');

// Retrieves the input for the "create" command
const getCreateInput = function ({ input, data }) {
  return {
    command: 'create',
    args: {
      pagination: false,
      newData: getCreateModels({ input, data }),
    },
  };
};

module.exports = {
  getCreateInput,
};
