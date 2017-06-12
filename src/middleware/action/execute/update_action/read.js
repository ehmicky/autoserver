'use strict';


const { pick, cloneDeep } = require('lodash');

const { commands } = require('../../../../constants');


// Retrieves the input for the "read" command
const getReadInput = function ({ input }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);

  const { args, action } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });

  const newArgs = pick(args, ['filter']);
  Object.assign(newArgs, { pagination: false });
  Object.assign(input, { command, args: newArgs });

  return input;
};


module.exports = {
  getReadInput,
};
