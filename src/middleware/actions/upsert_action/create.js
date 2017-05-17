'use strict';


const { cloneDeep, pick } = require('lodash');

const { commands } = require('../../../constants');


// Retrieves the input for the "create" command
const getCreateInput = function ({ input, data }) {
  input = cloneDeep(input);

  const isMultiple = input.action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'create' && multiple === isMultiple;
  });
  const args = getCreateArgs({ input, data });
  Object.assign(input, { command, args });

  return input;
};

const getCreateArgs = function ({ input: { args }, data }) {
  const updateArgs = pick(args, ['dry_run']);
  Object.assign(updateArgs, { data, no_output: true });
  return updateArgs;
};


module.exports = {
  getCreateInput,
};
