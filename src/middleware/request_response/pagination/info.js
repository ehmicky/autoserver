'use strict';

// Whether this is offset pagination (args.page)
// or cursor pagination (args.after|before)
const isOffset = function ({ args: { page } }) {
  return page !== undefined;
};

const getPagesize = function ({
  runOpts,
  args: { pagesize = runOpts.pagesize },
}) {
  return pagesize;
};

// We try to fetch the models before and after the current batch in order to
// guess has_prev_page and has_next_page
// If hasToken is false, it means we know we are at the beginning or end.
const getLimit = function ({ runOpts, args }) {
  const pagesize = getPagesize({ runOpts, args });
  return pagesize + 1;
};

const getRightToken = function ({ tokens }) {
  return tokens.after === undefined ? tokens.before : tokens.after;
};

// Used for cursor pagination.
const hasToken = function ({ args }) {
  const token = getRightToken({ tokens: args });
  return token !== undefined && token !== BOUNDARY_TOKEN;
};

// When iterating over cursors, those arguments must remain the same
const SAME_ARGS = ['order', 'filter'];

// Cursor tokens argument names
const TOKEN_NAMES = ['before', 'after'];

// Used to signify first|last batch
const BOUNDARY_TOKEN = '';

module.exports = {
  isOffset,
  getPagesize,
  getLimit,
  getRightToken,
  hasToken,
  SAME_ARGS,
  TOKEN_NAMES,
  BOUNDARY_TOKEN,
};
