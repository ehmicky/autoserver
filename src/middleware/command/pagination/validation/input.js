'use strict';

const { fastValidate } = require('../../../../fast_validation');
const { allowFullPagination } = require('../condition');

const { getDecodedTokens } = require('./decode');
const { noPageTests, cursorConflictTests, getTokenTests } = require('./tests');

// Validate pagination input arguments
const validatePaginationInput = function ({ args, command, maxPageSize }) {
  const decodedTokens = getDecodedTokens({ args });

  const tests = getTests({ args, command });
  fastValidate({
    prefix: 'Wrong pagination arguments: ',
    reason: 'INPUT_VALIDATION',
    tests,
  }, {
    ...args,
    ...decodedTokens,
    maxPageSize,
  });
};

const getTests = function ({ args, command }) {
  // When consumers can specify args.before|after|pageSize|page
  if (allowFullPagination({ args, command })) {
    const tokenTests = getTokenTests({ args });
    return [
      ...cursorConflictTests,
      ...tokenTests,
    ];
  }

  // When consumers can only specify args.pageSize,
  // or when consumers cannot specify any pagination-related argument
  return noPageTests;
};

module.exports = {
  validatePaginationInput,
};
