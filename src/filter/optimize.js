'use strict';

const { getOperator } = require('./operators');
const { mapNodes } = require('./crawl');

// Try to simplify AST
const optimizeFilter = function ({ filter }) {
  return mapNodes(filter, optimizeNode);
};

const optimizeNode = function (node) {
  const operator = getOperator({ node });

  const { optimize } = operator;
  if (optimize === undefined) { return node; }

  const nodeA = optimize(node);
  return nodeA;
};

module.exports = {
  optimizeFilter,
};
