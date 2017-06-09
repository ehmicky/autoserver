'use strict';


const { cloneDeep } = require('lodash');

const { commands } = require('../../../../constants');
const { getFilter } = require('../upsert_action/filter');


// Retrieves the input for the "read" command
const getReadInput = function ({ input }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);
  input.sysArgs = cloneDeep(input.sysArgs);

  const { sysArgs } = input;

  const isMultiple = true;
  const command = commands.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });

  const readArgs = getReadArgs({ input });
  Object.assign(sysArgs, { pagination: false });
  Object.assign(input, { command, args: readArgs, sysArgs });

  return input;
};

// Only keep args: { filter }
const getReadArgs = function ({ input }) {
  const filter = getFilter({ input });
  return { filter };
};

module.exports = {
  getReadInput,
};
