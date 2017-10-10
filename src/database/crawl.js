'use strict';

const { assignArray } = require('../utilities');

// Call `func(node)` recursively over each node of `args.filter`
const crawlFilter = function ({ type, attrName, value }, func) {
  const isParent = parentTypes.includes(type);

  if (!isParent) {
    return func({ type, attrName, value });
  }

  return value
    .map(node => crawlFilter(node, func))
    .reduce(assignArray, []);
};

const parentTypes = ['all', 'some', 'or', 'and'];

module.exports = {
  crawlFilter,
};
