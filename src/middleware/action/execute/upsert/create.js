'use strict';

const { getCreateModels } = require('./split');

// Retrieves the input for the "create" command
const getCreateInput = function ({ input, input: { args }, data }) {
  const newArgs = Object.assign({}, args);
  const createModels = getCreateModels({ input, data });
  Object.assign(newArgs, { pagination: false, newData: createModels });
  return { command: 'create', args: newArgs };
};

module.exports = {
  getCreateInput,
};
