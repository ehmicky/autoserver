'use strict';


const { cloneDeep, pick } = require('lodash');

const { commands } = require('../../../constants');
const { getFilter } = require('./filter');


// Retrieves the input for the second "read" command
// It is used for final output of "upsert" action
const getSecondReadInput = function ({ input }) {
  input = cloneDeep(input);
  const { sysArgs, action } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });
  const args = getReadArgs({ input });
  // The "real" commands are "create" and "update".
  // The first and second "find" commands are just here to patch things up,
  // and do not provide extra information to consumers, so should be
  // transparent when it comes to pagination and authorization
  Object.assign(sysArgs, { pagination: false, authorization: false });
  Object.assign(input, { command, args, sysArgs });

  return input;
};

// Only keep args: { filter, order_by, page_size }
const getReadArgs = function ({ input }) {
  const readArgs = pick(input.args, ['order_by', 'page_size']);
  const filter = getFilter({ input });

  Object.assign(readArgs, { filter });
  return readArgs;
};


module.exports = {
  getSecondReadInput,
};
