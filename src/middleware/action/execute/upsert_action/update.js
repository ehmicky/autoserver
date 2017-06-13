'use strict';


const { cloneDeep } = require('lodash');

const { commands } = require('../../../../constants');
const { pick } = require('../../../../utilities');


// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, data, models }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);

  const { args, action } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'update' && multiple === isMultiple;
  });

  const newArgs = pick(args, ['dry_run']);
  const newData = data;
  const currentData = isMultiple ? models : models[0];
  Object.assign(newArgs, { pagination: false, currentData, newData });
  Object.assign(input, { command, args: newArgs });

  return input;
};


module.exports = {
  getUpdateInput,
};
