'use strict';


const { cloneDeep, omit } = require('lodash');

const { commands } = require('../../../../constants');


// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, models }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);
  input.sysArgs = cloneDeep(input.sysArgs);

  const { sysArgs, action, args } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'update' && multiple === isMultiple;
  });
  const currentData = isMultiple ? models : models[0];

  const newArgs = omit(args, ['data']);
  newArgs.newData = args.data;

  Object.assign(sysArgs, { pagination: false, currentData });
  Object.assign(input, { command, args: newArgs, sysArgs });

  return input;
};


module.exports = {
  getUpdateInput,
};
