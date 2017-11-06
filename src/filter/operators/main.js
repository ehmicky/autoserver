'use strict';

const { _or, _and } = require('./or_and');
const { _some, _all } = require('./some_all');
const { _eq, _neq } = require('./eq_neq');
const { _lt, _gt, _lte, _gte } = require('./lt_gt_lte_gte');
const { _in, _nin } = require('./in_nin');
const { _like, _nlike } = require('./like_nlike');

const operators = {
  _or,
  _and,
  _some,
  _all,
  _eq,
  _neq,
  _lt,
  _gt,
  _lte,
  _gte,
  _in,
  _nin,
  _like,
  _nlike,
};

const getOperator = function ({ node }) {
  const hasOperator = node &&
    node.constructor === Object &&
    operators[node.type];
  if (!hasOperator) { return; }

  return operators[node.type];
};

const DEEP_OPERATORS = ['_some', '_all'];

module.exports = {
  getOperator,
  DEEP_OPERATORS,
};
