'use strict';

// List of defaults:
//  - key is argument attribute name
//  - command.name is whitelisted
//  - value is the default value.
//    Can be a function taking the server options as first argument
const defaults = {
  nFilter: {
    commands: ['readMany', 'deleteMany'],
    value: '(true)',
    // Only if args.before|after is not specified
    test: ({ input: { args: { before, after } } }) =>
      ((before === undefined || before === '') &&
      (after === undefined || after === '')),
  },

  nOrderBy: {
    commands: ['readMany', 'deleteMany', 'updateMany', 'createMany'],
    value: [{ attrName: 'id', order: 'asc' }],
    // Only if args.before|after is not specified
    test: ({ input: { args: { before, after } } }) =>
      ((before === undefined || before === '') &&
      (after === undefined || after === '')),
  },

  pageSize: {
    value: ({ serverOpts: { defaultPageSize } }) => defaultPageSize,
    // Only if pagination is enabled
    test: ({
      serverOpts: { defaultPageSize },
      input: { args: { pagination } },
    }) => defaultPageSize !== 0 && pagination,
  },

  after: {
    commands: ['readMany'],
    value: '',
    // Only if pagination is enabled, and args.before|page is not specified
    test: ({
      serverOpts: { defaultPageSize },
      input: { args: { before, page, pagination } },
    }) => defaultPageSize !== 0 &&
      pagination &&
      before === undefined &&
      page === undefined,
  },

  authorization: {
    value: true,
  },
};

module.exports = {
  defaults,
};
