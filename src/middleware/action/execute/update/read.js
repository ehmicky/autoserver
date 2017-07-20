'use strict';

const { pick } = require('../../../../utilities');

// Retrieves the input for the "read" command
const getReadInput = function ({ input: { args } }) {
  const newArgs = pick(args, ['filter']);
  Object.assign(newArgs, { pagination: false });
  return { command: 'read', args: newArgs };
};

module.exports = {
  getReadInput,
};
