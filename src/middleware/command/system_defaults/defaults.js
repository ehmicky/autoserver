'use strict';

// List of defaults:
//  - key is argument attribute name
//  - command is whitelisted
//  - value is the default value.
//    Can be a function taking the `run` options as first argument
const defaults = {
  filter: {
    commands: ['read', 'delete', 'update'],
    value: {},
  },

  // 'update', 'delete' is always sorted by 'id', i.e. user cannot specify it
  // The reason: paginated 'patch' might otherwise iterate over the same models
  // For 'delete', sorting is an unnecessary feature, so we keep it similar to
  // 'patch' action.
  orderBy: {
    commands: ['read', 'delete', 'update'],
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
    commands: ['read'],
    value: '',
    test: ({ args }) =>
      args.before === undefined && args.page === undefined,
  },
};

const hasNoPaginationTokens = function ({ args }) {
  return (args.before === undefined || args.before === '') &&
    (args.after === undefined || args.after === '');
};

module.exports = {
  defaults,
};
