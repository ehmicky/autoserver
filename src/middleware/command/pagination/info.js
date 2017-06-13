'use strict';


// Extra pagination-related information from arguments
const getPaginationInfo = function ({ args }) {
  const { after, before, pageSize, page } = args;

  const token = after || before;
  // Used for cursor pagination. If token is '' (i.e. start|end),
  // does not actually really cursors.
  const hasToken = token !== undefined && token !== '';
  const directionName = before !== undefined ? 'before' : 'after';
  const { isBackward, previous, next } = directionInfo[directionName];
  // We try to fetch the models before and after the current batch in order to
  // guess has_previous_page and has_next_page
  // If hasToken is false, it means we know we are at the beginning or end.
  const usedPageSize = pageSize + 1;
  // Whether this is offset pagination (args.page)
  // or cursor pagination (args.after|before)
  const isOffsetPagination = page !== undefined;

  return {
    token,
    hasToken,
    isBackward,
    previous,
    next,
    usedPageSize,
    isOffsetPagination,
  };
};

const directionInfo = {
  before: {
    // When using args.before, pagination is performed backward
    isBackward: true,
    previous: 'next',
    next: 'previous',
  },
  after: {
    isBackward: false,
    previous: 'previous',
    next: 'next',
  },
};


module.exports = {
  getPaginationInfo,
};
