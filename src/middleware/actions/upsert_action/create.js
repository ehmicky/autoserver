'use strict';


const { cloneDeep, pick } = require('lodash');

const { commands } = require('../../../constants');


// Retrieves the input for the "create" database action
const getCreateInput = function ({ input, data }) {
  input = cloneDeep(input);

  const isMultiple = input.action === 'upsertMany';
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
