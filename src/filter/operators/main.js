'use strict';

const { or, and } = require('./or_and');
const { some, all } = require('./some_all');
const { eq, neq } = require('./eq_neq');
const { lt, gt, lte, gte } = require('./lt_gt_lte_gte');
const { in: inOp, nin } = require('./in_nin');
const { like, nlike } = require('./like_nlike');

const operators = {
  or,
  and,
  some,
  all,
  eq,
  neq,
  lt,
  gt,
  lte,
  gte,
  in: inOp,
  nin,
  like,
  nlike,
};

const getOperator = function ({ node }) {
  const hasOperator = node &&
    node.constructor === Object &&
    operators[node.type];
  if (!hasOperator) { return; }

  return operators[node.type];
};

const DEEP_OPERATORS = ['some', 'all'];

module.exports = {
  getOperator,
  DEEP_OPERATORS,
};
