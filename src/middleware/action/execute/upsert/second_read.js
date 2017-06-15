'use strict';


const { cloneDeep } = require('lodash');

const { COMMANDS } = require('../../../../constants');
const { pick } = require('../../../../utilities');
const { getFilter } = require('./filter');


// Retrieves the input for the second "read" command
// It is used for final output of "upsert" action
const getSecondReadInput = function ({ input }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);

  const { args, action } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });

  // The "real" commands are "create" and "update".
  // The first and second "find" commands are just here to patch things up,
  // and do not provide extra information to consumers, so should be
  // transparent when it comes to pagination and authorization
  // Only keep args: { filter, orderBy, pageSize }
  const newArgs = pick(args, ['orderBy', 'pageSize']);
  const filter = getFilter({ input });
  Object.assign(newArgs, { pagination: false, authorization: false, filter });
  Object.assign(input, { command, args: newArgs });

  return input;
};


module.exports = {
  getSecondReadInput,
};
