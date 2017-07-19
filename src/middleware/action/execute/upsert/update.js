'use strict';

const { COMMANDS } = require('../../../../constants');

const { getUpdateModels } = require('./split');

// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, input: { args, action }, data }) {
  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'update' && multiple === isMultiple
  );

  const newArgs = Object.assign({}, args);
  const currentData = isMultiple ? data : data[0];
  const updateModels = getUpdateModels({ input, data });
  Object.assign(newArgs, {
    pagination: false,
    currentData,
    newData: updateModels,
  });
  return { command, args: newArgs };
};

module.exports = {
  getUpdateInput,
};
