'use strict';


const { pick, cloneDeep } = require('lodash');


// Retrieves the input for the "find" database action
const getFindInput = function ({ input }) {
  input = cloneDeep(input);

  const actionType = 'find';
  const action = input.action === 'updateOne' ? 'findOne' : 'findMany';
  const args = getFindArgs({ args: input.args });
  // Disables pagination
  const maxPageSize = 0;

  Object.assign(input, { actionType, action, args, maxPageSize });
  Object.assign(input.info, { actionType });

  return input;
};

// Only keep args: { filter }
const getFindArgs = function ({ args }) {
  return pick(args, ['filter']);
};


module.exports = {
  getFindInput,
};
