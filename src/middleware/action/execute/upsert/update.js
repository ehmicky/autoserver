'use strict';

const { cloneDeep } = require('lodash');

const { COMMANDS } = require('../../../../constants');

const { getUpdateModels } = require('./split');

// Retrieves the input for the "update" command
const getUpdateInput = function ({ input: oInput, data }) {
  const input = Object.assign({}, oInput);
  input.args = cloneDeep(input.args);

  const { args, action } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'update' && multiple === isMultiple
  );

  const newArgs = Object.assign({}, args);
  const currentData = isMultiple ? data : data[0];
  const updateModels = getUpdateModels({ input: oInput, data });
  Object.assign(newArgs, {
    pagination: false,
    currentData,
    newData: updateModels,
  });
  Object.assign(input, { command, args: newArgs });

  return input;
};

module.exports = {
  getUpdateInput,
};
