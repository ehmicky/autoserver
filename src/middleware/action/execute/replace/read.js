'use strict';

const { cloneDeep } = require('lodash');

const { COMMANDS } = require('../../../../constants');
// eslint-disable-next-line import/no-internal-modules
const { getFilter } = require('../upsert/filter');

// Retrieves the input for the "read" command
const getReadInput = function ({ input }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);

  const { action } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) => type === 'read' && multiple === isMultiple);

  const filter = getFilter({ input });
  const newArgs = { filter, pagination: false };
  Object.assign(input, { command, args: newArgs });

  return input;
};

module.exports = {
  getReadInput,
};
