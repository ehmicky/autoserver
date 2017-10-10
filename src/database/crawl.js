'use strict';

const { assignArray } = require('../utilities');

// Call `func(node)` recursively over each node of `args.filter`
const crawlFilter = function ({ type, attrName, value }, func) {
  const returnValue = func({ type, attrName, value });

  const isParent = parentTypes.includes(type);
  const nodes = isParent ? value : [];
  const children = nodes
    .map(node => crawlFilter(node, func))
    .reduce(assignArray, []);

  return returnValue === undefined ? children : [returnValue, ...children];
};

const parentTypes = ['all', 'some', 'or', 'and'];

module.exports = {
  crawlFilter,
};
