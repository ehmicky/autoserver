'use strict';

// List of defaults:
//  - key is argument attribute name
//  - command.name is whitelisted
//  - value is the default value.
//    Can be a function taking the `run` options as first argument
const defaults = {
  filter: {
    commands: ['readMany', 'deleteMany'],
    value: {},
  },

  orderBy: {
    commands: ['readMany', 'deleteMany'],
    value: [{ attrName: 'id', order: 'asc' }],
    test: ({ args }) => hasNoPaginationTokens({ args }),
  },

  pageSize: {
    value: ({ runOpts: { defaultPageSize } }) => defaultPageSize,
    // Only if pagination is enabled
    test: ({ runOpts: { defaultPageSize } }) =>
      defaultPageSize !== 0,
  },

  after: {
    commands: ['readMany'],
    value: '',
    test: ({ args }) =>
      args.before === undefined && args.page === undefined,
  },

  internal: {
    value: false,
  },
};

const hasNoPaginationTokens = function ({ args }) {
  return (args.before === undefined || args.before === '') &&
    (args.after === undefined || args.after === '');
};

module.exports = {
  defaults,
};
