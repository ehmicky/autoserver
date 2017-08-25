'use strict';

const { fastValidate } = require('../../../../utilities');
const { allowFullPagination, mustPaginateOutput } = require('../condition');

const { getDecodedTokens } = require('./decode');
const {
  noPageTests,
  pageTests,
  pageSizeTests,
  cursorConflictTests,
  getTokenTests,
} = require('./tests');

// Validate pagination input arguments
const validatePaginationInput = function ({ args, command, maxPageSize }) {
  const decodedTokens = getDecodedTokens({ args });
  const argsA = { ...args, ...decodedTokens };

  const tests = getTests({ args: argsA, command });
  fastValidate({
    prefix: 'Wrong pagination arguments: ',
    reason: 'INPUT_VALIDATION',
    tests,
  }, {
    args: argsA,
    maxPageSize,
  });
};

const getTests = function ({ args, command }) {
  // When consumers can specify args.before|after|pageSize|page
  if (allowFullPagination({ args, command })) {
    const tokenTests = getTokenTests({ args });
    return [
      ...pageSizeTests,
      ...pageTests,
      ...cursorConflictTests,
      ...tokenTests,
    ];
  }

  // When consumers can only specify args.pageSize
  if (mustPaginateOutput({ args, command })) {
    return [...noPageTests, ...pageSizeTests];
  }

  // When consumers cannot specify any pagination-related argument
  return noPageTests;
};

module.exports = {
  validatePaginationInput,
};
