'use strict';

const { cloneDeep } = require('lodash');

const { COMMANDS } = require('../../../../constants');

const { getCreateModels } = require('./split');

// Retrieves the input for the "create" command
const getCreateInput = function ({ input: oInput, data }) {
  const input = Object.assign({}, oInput);
  input.args = cloneDeep(input.args);

  const { args, action } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'create' && multiple === isMultiple
  );

  const newArgs = Object.assign({}, args);
  const createModels = getCreateModels({ input: oInput, data });
  Object.assign(newArgs, { pagination: false, newData: createModels });
  Object.assign(input, { command, args: newArgs });

  return input;
};

module.exports = {
  getCreateInput,
};
