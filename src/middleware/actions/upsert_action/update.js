'use strict';


const { cloneDeep, pick } = require('lodash');

const { commands } = require('../../../constants');


// Retrieves the input for the "update" database action
const getUpdateInput = function ({ input, data }) {
  input = cloneDeep(input);

  const isMultiple = input.action === 'upsertMany';
  const command = commands.find(({ type, multiple }) => {
    return type === 'update' && multiple === isMultiple;
  });
  const args = getUpdateArgs({ input, data });
  Object.assign(input, { command, args });

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
