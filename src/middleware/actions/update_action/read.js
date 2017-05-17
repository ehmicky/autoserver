'use strict';


const { pick, cloneDeep } = require('lodash');

const { commands } = require('../../../constants');


// Retrieves the input for the "read" command
const getReadInput = function ({ input }) {
  input = cloneDeep(input);

  const isMultiple = input.action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });
  const args = getReadArgs({ args: input.args });

  Object.assign(input, { command, args });
  Object.assign(input.sysArgs, { pagination: false });

  return input;
};

// Only keep args: { filter }
const getReadArgs = function ({ args }) {
  return pick(args, ['filter']);
};


module.exports = {
  getReadInput,
};
