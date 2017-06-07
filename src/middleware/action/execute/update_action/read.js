'use strict';


const { pick, cloneDeep } = require('lodash');

const { commands } = require('../../../../constants');


// Retrieves the input for the "read" command
const getReadInput = function ({ input }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);
  input.sysArgs = cloneDeep(input.sysArgs);

  const { sysArgs, args, action } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });
  const readArgs = getReadArgs({ args });

  Object.assign(sysArgs, { pagination: false });
  Object.assign(input, { command, args: readArgs, sysArgs });

  return input;
};

// Only keep args: { filter }
const getReadArgs = function ({ args }) {
  return pick(args, ['filter']);
};


module.exports = {
  getReadInput,
};
