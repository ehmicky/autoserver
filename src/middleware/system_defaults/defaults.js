'use strict';


// List of defaults:
//  - key is argument attribute name
//  - commandNames are whitelisted
//  - value is the default value.
//    Can be a function taking the server options as first argument
const defaults = {
  args: {
    filter: {
      commandNames: ['readMany', 'deleteMany'],
      value: '(true)',
    },

    order_by: {
      commandNames: ['readMany', 'deleteMany', 'updateMany', 'createMany'],
      value: 'id+',
    },

    dry_run: {
      commandNames: [
        'deleteOne',
        'deleteMany',
        'updateOne',
        'updateMany',
        'createOne',
        'createMany',
      ],
      value: false,
    },

    no_output: {
      commandNames: [
        'deleteOne',
        'deleteMany',
        'updateOne',
        'updateMany',
        'createOne',
        'createMany',
      ],
      value: false,
    },

    page_size: {
      commandNames: ['readMany', 'deleteMany', 'updateMany', 'createMany'],
      value: ({ opts: { defaultPageSize } }) => defaultPageSize,
      // Only if pagination is enabled
      test: ({
        opts: { defaultPageSize },
        input: { sysArgs: { maxPageSize } },
      }) =>
        defaultPageSize !== 0 && maxPageSize !== 0,
    },

    after: {
      commandNames: ['readMany'],
      value: '',
      // Only if pagination is enabled, and arg.before|page is not specified
      test: ({
        opts: { defaultPageSize },
        input: { args: { before, page }, sysArgs: { maxPageSize } },
      }) => defaultPageSize !== 0 &&
        maxPageSize !== 0 &&
        before === undefined &&
        page === undefined
    },
  },
};


module.exports = {
  defaults,
};
