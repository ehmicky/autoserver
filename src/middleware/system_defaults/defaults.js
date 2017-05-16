'use strict';


// List of defaults:
//  - key is argument attribute name
//  - actions are whitelisted
//  - value is the default value.
//    Can be a function taking the server options as first argument
const defaults = {
  args: {
    filter: {
      actions: ['findMany', 'deleteMany'],
      value: '(true)',
    },

    order_by: {
      actions: ['findMany', 'deleteMany', 'updateMany', 'createMany'],
      value: 'id+',
    },

    dry_run: {
      actions: [
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
      actions: [
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
      actions: ['findMany', 'deleteMany', 'updateMany', 'createMany'],
      value: ({ opts: { defaultPageSize } }) => defaultPageSize,
      // Only if pagination is enabled
      test: ({ opts: { defaultPageSize }, input: { maxPageSize } }) =>
        defaultPageSize !== 0 && maxPageSize !== 0,
    },

    after: {
      actions: ['findMany'],
      value: '',
      // Only if pagination is enabled, and arg.before|page is not specified
      test: ({
        opts: { defaultPageSize },
        input: { args: { before, page }, maxPageSize },
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
