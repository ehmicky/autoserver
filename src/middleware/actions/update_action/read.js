'use strict';


const { pick, cloneDeep } = require('lodash');

const { commands } = require('../../../constants');


// Retrieves the input for the "read" database action
const getReadInput = function ({ input }) {
  input = cloneDeep(input);

  const isMultiple = input.action === 'updateMany';
  const command = commands.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });
  const args = getReadArgs({ args: input.args });
  // Disables pagination
  const maxPageSize = 0;

  Object.assign(input, { command, args });
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
