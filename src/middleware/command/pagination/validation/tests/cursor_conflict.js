'use strict';

const { isEqual } = require('lodash');

const cursorConflictTests = [
  {
    test ({ before: bef, after: aft }) {
      return bef !== undefined && aft !== undefined;
    },
    message: 'cannot specify both \'before\' and \'after\'',
  },

  {
    test ({ page, before: bef, after: aft }) {
      return page !== undefined && (bef !== undefined || aft !== undefined);
    },
    message: 'cannot use both \'page\' and \'before\' or \'after\'',
  },

  {
    test ({ filter, before: bef, after: aft }) {
      return hasCursor({ bef, aft }) &&
        filter !== undefined &&
        !isEqual(filter, {});
    },
    message: 'cannot use both \'filter\' and \'before\' or \'after\'',
  },

  {
    test ({ orderBy, before: bef, after: aft }) {
      return hasCursor({ bef, aft }) && orderBy !== undefined;
    },
    message: 'cannot use both \'order_by\' and \'before\' or \'after\'',
  },
];

const hasCursor = function ({ bef, aft }) {
  return (bef !== undefined && bef !== '') || (aft !== undefined && aft !== '');
};

module.exports = {
  cursorConflictTests,
};
