'use strict';


const { cloneDeep } = require('lodash');

const { commands } = require('../../../../constants');
const { getFilter } = require('./filter');


// Retrieves the input for the first "read" command
// Goal is to check whether models exist, so we know if "upsert" action
// will create or update models.
const getFirstReadInput = function ({ input }) {
  input = cloneDeep(input);
  const { sysArgs } = input;

  const isMultiple = true;
  const command = commands.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });
  const readArgs = getReadArgs({ input });
  // The "real" commands are "create" and "update".
  // The first and second "find" commands are just here to patch things up,
  // and do not provide extra information to consumers, so should be
  // transparent when it comes to pagination and authorization
  Object.assign(sysArgs, { pagination: false, authorization: false });
  Object.assign(input, { command, args: readArgs, sysArgs });

  return input;
};

// Only keep args: { filter }
const getReadArgs = function ({ input }) {
  const filter = getFilter({ input });
  return { filter };
};


module.exports = {
  getFirstReadInput,
};
