'use strict';


// List of defaults:
//  - key is argument attribute name
//  - command.name is whitelisted
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
      value: ({ opts: { defaultPageSize } }) => defaultPageSize,
      // Only if pagination is enabled
      test: ({
        opts: { defaultPageSize },
        input: { sysArgs: { pagination = true } },
      }) => defaultPageSize !== 0 && pagination,
    },

    after: {
      commandNames: ['readMany'],
      value: '',
      // Only if pagination is enabled, and arg.before|page is not specified
      test: ({
        opts: { defaultPageSize },
        input: { args: { before, page }, sysArgs: { pagination = true } },
      }) => defaultPageSize !== 0 &&
        pagination &&
        before === undefined &&
        page === undefined
    },
  },
};


module.exports = {
  defaults,
};
