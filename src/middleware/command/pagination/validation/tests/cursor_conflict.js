'use strict';

const { isEqual } = require('lodash');

const cursorConflictTests = [
  {
    test ({ args }) {
      return args.before !== undefined && args.after !== undefined;
    },
    message: 'cannot specify both \'before\' and \'after\'',
  },

  {
    test ({ args }) {
      return args.page !== undefined &&
        (args.before !== undefined || args.after !== undefined);
    },
    message: 'cannot use both \'page\' and \'before\' or \'after\'',
  },

  {
    test ({ args, args: { filter } }) {
      return hasCursor({ args }) &&
        filter !== undefined &&
        !isEqual(filter, {});
    },
    message: 'cannot use both \'filter\' and \'before\' or \'after\'',
  },

  {
    test ({ args, args: { orderBy } }) {
      return hasCursor({ args }) && orderBy !== undefined;
    },
    message: 'cannot use both \'order_by\' and \'before\' or \'after\'',
  },
];

const hasCursor = function ({ args }) {
  return (args.before !== undefined && args.before !== '') ||
    (args.after !== undefined && args.after !== '');
};

module.exports = {
  cursorConflictTests,
};
