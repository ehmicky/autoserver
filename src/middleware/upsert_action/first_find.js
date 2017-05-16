'use strict';


const { cloneDeep } = require('lodash');

const { getFilter } = require('./filter');


// Retrieves the input for the first "find" database action
// Goal is to check whether models exist, so we know if "upsert" action
// will create or update models.
const getFirstFindInput = function ({ input, prefix }) {
  input = cloneDeep(input);

  const actionType = 'find';
  const action = 'findMany';
  const args = getFindArgs({ input, prefix });
  // Disables pagination
  const maxPageSize = 0;

  Object.assign(input, { actionType, action, args });
  Object.assign(input.sysArgs, { maxPageSize });
  Object.assign(input.info, { actionType });

  return input;
};

// Only keep args: { filter }
const getFindArgs = function ({ input, prefix }) {
  const filter = getFilter({ input, prefix });
  return { filter };
};


module.exports = {
  getFirstFindInput,
};
