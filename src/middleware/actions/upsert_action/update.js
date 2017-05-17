'use strict';


const { cloneDeep, pick } = require('lodash');

const { commands } = require('../../../constants');


// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, data }) {
  input = cloneDeep(input);
  const { sysArgs = {}, action } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'update' && multiple === isMultiple;
  });
  const args = getUpdateArgs({ input, data });
  Object.assign(sysArgs, { pagination: false });
  Object.assign(input, { command, args, sysArgs });

  return input;
};

const getUpdateArgs = function ({ input: { args }, data }) {
  const updateArgs = pick(args, ['dry_run']);
  Object.assign(updateArgs, { data, no_output: true });
  return updateArgs;
};


module.exports = {
  getUpdateInput,
};
