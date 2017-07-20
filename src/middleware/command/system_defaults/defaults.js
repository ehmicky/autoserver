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
    test: ({ input: { args } }) =>
      ((args.before === undefined || args.before === '') &&
      (args.after === undefined || args.after === '')),
  },

  nOrderBy: {
    commands: [
      'readMany',
      'deleteMany',
      'updateMany',
      'upsertMany',
      'createMany',
    ],
    value: [{ attrName: 'id', order: 'asc' }],
    // Only if args.before|after is not specified
    test: ({ input: { args } }) =>
      ((args.before === undefined || args.before === '') &&
      (args.after === undefined || args.after === '')),
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
      input: { args },
    }) => defaultPageSize !== 0 &&
      args.pagination &&
      args.before === undefined &&
      args.page === undefined,
  },

  internal: {
    value: false,
  },
};

module.exports = {
  defaults,
};
