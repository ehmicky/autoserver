'use strict';

const { COMMANDS } = require('../../../../constants');

const { getCreateModels } = require('./split');

// Retrieves the input for the "create" command
const getCreateInput = function ({ input, input: { args, action }, data }) {
  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'create' && multiple === isMultiple
  );

  const newArgs = Object.assign({}, args);
  const createModels = getCreateModels({ input, data });
  Object.assign(newArgs, { pagination: false, newData: createModels });
  return { command, args: newArgs };
};

module.exports = {
  getCreateInput,
};
