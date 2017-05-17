'use strict';


const { cloneDeep, pick } = require('lodash');


// Retrieves the input for the "create" database action
const getCreateInput = function ({ input, data }) {
  input = cloneDeep(input);

  const commandType = 'create';
  const commandName = input.action === 'upsertMany'
    ? 'createMany'
    : 'createOne';
  const args = getCreateArgs({ input, data });
  Object.assign(input, { commandType, commandName, args });

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
