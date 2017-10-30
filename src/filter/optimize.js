'use strict';

const { fullRecurseMap } = require('../utilities');

const { getOperator } = require('./operators');

// Try to simplify AST
const optimizeFilter = function ({ filter }) {
  return fullRecurseMap(filter, optimizeNode);
};

const optimizeNode = function (node) {
  const operator = getOperator({ node });
  // Is not a node
  if (operator === undefined) { return node; }

  const { optimize } = operator;
  if (optimize === undefined) { return node; }

  const nodeA = optimize(node);
  return nodeA;
};

module.exports = {
  optimizeFilter,
};
