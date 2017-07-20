'use strict';

const { validate } = require('../../../../../validation');

const { getInputSchema } = require('./schema');
const { getInputData } = require('./data');

// Validate args.before|after|pageSize|page
const validatePaginationInput = function ({
  args,
  action,
  command,
  modelName,
  maxPageSize,
}) {
  const schema = getInputSchema({ args, command, maxPageSize });
  const data = getInputData({ args });
  const reportInfo = {
    type: 'paginationInput',
    action,
    modelName,
    dataVar: 'arguments',
  };
  validate({ schema, data, reportInfo });
};

module.exports = {
  validatePaginationInput,
};
