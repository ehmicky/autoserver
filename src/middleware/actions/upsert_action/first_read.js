'use strict';


const { cloneDeep } = require('lodash');

const { commands } = require('../../../constants');
const { getFilter } = require('./filter');


// Retrieves the input for the first "read" command
// Goal is to check whether models exist, so we know if "upsert" action
// will create or update models.
const getFirstReadInput = function ({ input, prefix }) {
  input = cloneDeep(input);
  const { sysArgs } = input;

  const isMultiple = true;
  const command = commands.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });
  const readArgs = getReadArgs({ input, prefix });
  Object.assign(sysArgs, { pagination: false });
  Object.assign(input, { command, args: readArgs, sysArgs });

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
