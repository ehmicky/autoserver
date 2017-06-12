'use strict';


const { cloneDeep, pick } = require('lodash');

const { commands } = require('../../../../constants');


// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, data, models }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);
  input.sysArgs = cloneDeep(input.sysArgs);

  const { sysArgs, action } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'update' && multiple === isMultiple;
  });
  const args = getUpdateArgs({ input, data });
  const currentData = isMultiple ? models : models[0];
  Object.assign(sysArgs, { pagination: false, currentData });
  Object.assign(input, { command, args, sysArgs });

  return input;
};

const getUpdateArgs = function ({ input: { args }, data }) {
  const updateArgs = pick(args, ['dry_run']);
  updateArgs.newData = data;
  return updateArgs;
};


module.exports = {
  getUpdateInput,
};
