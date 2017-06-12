'use strict';


const { cloneDeep } = require('lodash');

const { commands } = require('../../../../constants');
const { getFilter } = require('../upsert_action/filter');


// Retrieves the input for the "read" command
const getReadInput = function ({ input }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);

  const { action } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });

  const filter = getFilter({ input });
  const newArgs = { filter, pagination: false };
  Object.assign(input, { command, args: newArgs });

  return input;
};


module.exports = {
  getReadInput,
};
