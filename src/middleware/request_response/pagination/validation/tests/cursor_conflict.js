'use strict';

const cursorConflictTests = [
  {
    test ({ before: bef, after: aft }) {
      return !(bef != null && aft != null);
    },
    message: 'cannot specify both \'before\' and \'after\'',
  },

  {
    test ({ page, before: bef, after: aft }) {
      return !(page != null && (bef != null || aft != null));
    },
    message: 'cannot use both \'page\' and \'before\' or \'after\'',
  },

  {
    test ({ filter, before: bef, after: aft }) {
      return !(hasCursor({ bef, aft }) && filter != null);
    },
    message: 'cannot use both \'filter\' and \'before\' or \'after\'',
  },

  {
    test ({ orderby, before: bef, after: aft }) {
      return !(hasCursor({ bef, aft }) && orderby != null);
    },
    message: 'cannot use both \'orderby\' and \'before\' or \'after\'',
  },
];

const hasCursor = function ({ bef, aft }) {
  return (bef != null && bef !== '') || (aft != null && aft !== '');
};

module.exports = {
  cursorConflictTests,
};
