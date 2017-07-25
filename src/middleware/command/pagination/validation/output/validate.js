'use strict';

const { validate } = require('../../../../../validation');
const { throwError } = require('../../../../../error');
const { getPaginationInfo } = require('../../info');

const { getOutputSchema } = require('./schema');
const { getOutputData } = require('./data');

// Validate response.metadata related to pagination
const validatePaginationOutput = function ({
  args,
  action,
  modelName,
  maxPageSize,
  response: { data, metadata },
}) {
  const schema = getOutputSchema({ maxPageSize });
  const pages = getOutputData({ metadata });
  const reportInfo = {
    type: 'paginationOutput',
    action,
    modelName,
    dataVar: 'response',
  };
  validate({ schema, data: pages, reportInfo });

  const { usedPageSize } = getPaginationInfo({ args });

  if (data.length > usedPageSize) {
    const message = `Database returned pagination batch larger than specified page size ${args.pageSize}`;
    throwError(message, { reason: 'OUTPUT_VALIDATION' });
  }
};

module.exports = {
  validatePaginationOutput,
};
