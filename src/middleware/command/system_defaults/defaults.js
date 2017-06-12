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
      // Only if args.before|after is not specified
      test: ({ input: { args: { before, after } } }) =>
        ((before === undefined || before === '') &&
        (after === undefined || after === ''))
    },

    order_by: {
      commandNames: ['readMany', 'deleteMany', 'updateMany', 'createMany'],
      value: [{ attrName: 'id', order: 'asc' }],
      // Only if args.before|after is not specified
      test: ({ input: { args: { before, after } } }) =>
        ((before === undefined || before === '') &&
        (after === undefined || after === ''))
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

    page_size: {
      value: ({ opts: { defaultPageSize } }) => defaultPageSize,
      // Only if pagination is enabled
      test: ({
        opts: { defaultPageSize },
        input: { sysArgs: { pagination } },
      }) => defaultPageSize !== 0 && pagination,
    },

    after: {
      commandNames: ['readMany'],
      value: '',
      // Only if pagination is enabled, and args.before|page is not specified
      test: ({
        opts: { defaultPageSize },
        input: { args: { before, page }, sysArgs: { pagination } },
      }) => defaultPageSize !== 0 &&
        pagination &&
        before === undefined &&
        page === undefined
    },
  },

  sysArgs: {
    authorization: {
      value: true,
    },
  },
};


module.exports = {
  defaults,
};
