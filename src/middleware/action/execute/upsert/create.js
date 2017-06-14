'use strict';


const { cloneDeep } = require('lodash');

const { commands } = require('../../../../constants');


// Retrieves the input for the "create" command
const getCreateInput = function ({ input, data }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);

  const { args, action } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'create' && multiple === isMultiple;
  });

  const newArgs = Object.assign({}, args);
  const newData = data;
  Object.assign(newArgs, { pagination: false, newData });
  Object.assign(input, { command, args: newArgs });

  return input;
};


module.exports = {
  getCreateInput,
};
