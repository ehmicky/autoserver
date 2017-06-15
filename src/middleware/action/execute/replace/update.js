'use strict';


const { cloneDeep } = require('lodash');

const { COMMANDS } = require('../../../../constants');
const { omit } = require('../../../../utilities');


// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, models }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);

  const { action, args } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) => {
    return type === 'update' && multiple === isMultiple;
  });
  const currentData = isMultiple ? models : models[0];

  const newArgs = omit(args, ['data']);
  const newData = args.data;

  Object.assign(newArgs, { pagination: false, currentData, newData });
  Object.assign(input, { command, args: newArgs });

  return input;
};


module.exports = {
  getUpdateInput,
};
