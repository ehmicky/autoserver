'use strict';

const { reverseArray } = require('../../../utilities');

// When using args.before, reverse args.filter on input
const getBackwardFilter = function ({ args, node, node: { type } }) {
  if (!isBackward({ args })) { return node; }

  const typeA = type === '_gt' ? '_lt' : '_gt';
  return { ...node, type: typeA };
};

// When using args.before, reverse args.order on input
const getBackwardOrder = function ({ args, args: { order } }) {
  if (!isBackward({ args })) { return; }

  const orderA = order.map(({ attrName, dir }) =>
    ({ attrName, dir: dir === 'asc' ? 'desc' : 'asc' }));
  return { order: orderA };
};

// When using args.before, reverse both output and metadata on output.
const getBackwardResponse = function ({
  args,
  response,
  response: { data, metadata, metadata: { pages } },
}) {
  if (!isBackward({ args })) { return response; }

  const dataA = reverseArray(data);

  const pagesA = {
    ...pages,
    has_previous_page: pages.has_next_page,
    has_next_page: pages.has_previous_page,
    previous_token: pages.next_token,
    next_token: pages.previous_token,
    first_token: pages.last_token,
    last_token: pages.first_token,
  };

  return {
    ...response,
    data: dataA,
    metadata: { ...metadata, pages: pagesA },
  };
};

const isBackward = function ({ args }) {
  return args.before !== undefined;
};

module.exports = {
  getBackwardFilter,
  getBackwardOrder,
  getBackwardResponse,
};
