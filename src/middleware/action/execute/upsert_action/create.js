'use strict';


const { cloneDeep, pick } = require('lodash');

const { commands } = require('../../../../constants');


// Retrieves the input for the "create" command
const getCreateInput = function ({ input, data }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);
  input.sysArgs = cloneDeep(input.sysArgs);

  const { sysArgs, action } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'create' && multiple === isMultiple;
  });
  const createArgs = getCreateArgs({ input, data });
  Object.assign(sysArgs, { pagination: false });
  Object.assign(input, { command, args: createArgs, sysArgs });

  return input;
};

const getCreateArgs = function ({ input: { args }, data }) {
  const updateArgs = pick(args, ['dry_run']);
  updateArgs.newData = data;
  return updateArgs;
};


module.exports = {
  getCreateInput,
};
