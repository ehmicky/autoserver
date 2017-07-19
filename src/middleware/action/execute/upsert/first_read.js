'use strict';

const { COMMANDS } = require('../../../../constants');

const { getFilter } = require('./filter');

// Retrieves the input for the first "read" command
// Goal is to check whether models exist, so we know if "upsert" action
// will create or update models.
const getFirstReadInput = function ({ input }) {
  const isMultiple = true;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'read' && multiple === isMultiple
  );

  // The "real" commands are "create" and "update".
  // The first and second "find" commands are just here to patch things up,
  // and do not provide extra information to consumers, so should be
  // transparent when it comes to pagination and authorization
  const filter = getFilter({ input });
  const newArgs = { filter, pagination: false, authorization: false };
  return { command, args: newArgs };
};

module.exports = {
  getFirstReadInput,
};
