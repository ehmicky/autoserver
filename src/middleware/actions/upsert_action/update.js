'use strict';


const { cloneDeep, pick } = require('lodash');


// Retrieves the input for the "update" database action
const getUpdateInput = function ({ input, data }) {
  input = cloneDeep(input);

  const dbCall = 'update';
  const dbCallFull = input.action === 'upsertMany' ? 'updateMany' : 'updateOne';
  const args = getUpdateArgs({ input, data });
  Object.assign(input, { dbCall, dbCallFull, args });

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
