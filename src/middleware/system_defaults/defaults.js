'use strict';


// List of defaults:
//  - key is argument attribute name
//  - actions are whitelisted
//  - value is the default value. Can be a function taking the server options as first argument
const defaults = {
  filter: {
    actions: ['findMany', 'deleteMany', 'updateMany'],
    value: '(true)',
  },

  order_by: {
    actions: ['findMany', 'deleteMany', 'updateMany', 'upsertMany', 'replaceMany', 'createMany'],
    value: 'id+',
  },

  dry_run: {
    actions: ['deleteOne', 'deleteMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'replaceOne', 'replaceMany',
    'createOne', 'createMany'],
    value: false,
  },

  page_size: {
    actions: ['findMany', 'deleteMany', 'updateMany'],
    value: ({ opts: { defaultPageSize } }) => defaultPageSize,
    // Only if pagination is enabled
    test: ({ opts: { defaultPageSize } }) => defaultPageSize !== 0,
  },

  after: {
    actions: ['findMany'],
    value: '',
    // Only if pagination is enabled, and arg.before|page is not specified
    test: ({ opts: { defaultPageSize }, input: { args: { before, page } } }) =>
      defaultPageSize !== 0 &&
        before === undefined &&
        page === undefined
  },
};


module.exports = {
  defaults,
};
