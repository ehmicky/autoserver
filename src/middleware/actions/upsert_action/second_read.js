'use strict';


const { cloneDeep, pick } = require('lodash');

const { getFilter } = require('./filter');


// Retrieves the input for the second "read" database action
// It is used for final output of "upsert"
const getSecondReadInput = function ({ input, prefix }) {
  input = cloneDeep(input);

  const commandType = 'read';
  const commandName = input.action === 'upsertMany' ? 'readMany' : 'readOne';
  const args = getReadArgs({ input, prefix });

  Object.assign(input, { commandType, commandName, args });

  return input;
};

// Only keep args: { filter, order_by, page_size }
const getReadArgs = function ({ input, prefix }) {
  const readArgs = pick(input.args, ['order_by', 'page_size']);
  const filter = getFilter({ input, prefix });

  Object.assign(readArgs, { filter });
  return readArgs;
};


module.exports = {
  getSecondReadInput,
};
