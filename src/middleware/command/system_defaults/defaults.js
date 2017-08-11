'use strict';

// List of defaults:
//  - key is argument attribute name
//  - command.name is whitelisted
//  - value is the default value.
//    Can be a function taking the runtime options as first argument
const defaults = {
  nFilter: {
    commands: ['readMany', 'deleteMany'],
    value: '(true)',
    test: ({ input }) => hasNoPaginationTokens({ input }),
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
    test: ({ input }) => hasNoPaginationTokens({ input }),
  },

  pageSize: {
    value: ({ input: { runtimeOpts: { defaultPageSize } } }) => defaultPageSize,
    // Only if pagination is enabled
    test: ({ input: { runtimeOpts: { defaultPageSize } } }) =>
      defaultPageSize !== 0,
  },

  after: {
    commands: ['readMany'],
    value: '',
    test: ({ input: { args } }) =>
      args.before === undefined && args.page === undefined,
  },

  internal: {
    value: false,
  },
};

const hasNoPaginationTokens = function ({ input: { args } }) {
  return (args.before === undefined || args.before === '') &&
    (args.after === undefined || args.after === '');
};

module.exports = {
  defaults,
};
