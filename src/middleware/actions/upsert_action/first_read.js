'use strict';


const { cloneDeep } = require('lodash');

const { getFilter } = require('./filter');


// Retrieves the input for the first "read" database action
// Goal is to check whether models exist, so we know if "upsert" action
// will create or update models.
const getFirstReadInput = function ({ input, prefix }) {
  input = cloneDeep(input);

  const dbCall = 'read';
  const dbCallFull = 'readMany';
  const args = getReadArgs({ input, prefix });
  // Disables pagination
  const maxPageSize = 0;

  Object.assign(input, { dbCall, dbCallFull, args });
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
