'use strict';


const { pick, cloneDeep } = require('lodash');


// Retrieves the input for the "read" database action
const getReadInput = function ({ input }) {
  input = cloneDeep(input);

  const commandType = 'read';
  const commandName = input.action === 'updateOne' ? 'readOne' : 'readMany';
  const args = getReadArgs({ args: input.args });
  // Disables pagination
  const maxPageSize = 0;

  Object.assign(input, { commandType, commandName, args });
  Object.assign(input.sysArgs, { maxPageSize });

  return input;
};

// Only keep args: { filter }
const getReadArgs = function ({ args }) {
  return pick(args, ['filter']);
};


module.exports = {
  getReadInput,
};
