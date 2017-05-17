'use strict';


const { cloneDeep } = require('lodash');

const { getFilter } = require('./filter');


// Retrieves the input for the first "read" database action
// Goal is to check whether models exist, so we know if "upsert" action
// will create or update models.
const getFirstReadInput = function ({ input, prefix }) {
  input = cloneDeep(input);

  const commandType = 'read';
  const commandName = 'readMany';
  const args = getReadArgs({ input, prefix });
  // Disables pagination
  const maxPageSize = 0;

  Object.assign(input, { commandType, commandName, args });
  Object.assign(input.sysArgs, { maxPageSize });

  return input;
};

// Only keep args: { filter }
const getReadArgs = function ({ input, prefix }) {
  const filter = getFilter({ input, prefix });
  return { filter };
};


module.exports = {
  getFirstReadInput,
};
