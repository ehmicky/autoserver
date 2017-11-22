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
    operators[node.type] !== undefined;
  if (!hasOperator) { return; }

  const operator = operators[node.type];
  return operator;
};

// Operators that have other operators as children
const PARENT_OPERATORS = ['_all', '_some', '_or', '_and'];

// Operators that are combined with their children operators
const DEEP_OPERATORS = ['_some', '_all'];

// Operators that are parent to attributes
const ATTR_PARENT_OPERATORS = ['_and'];

// Operators that are parent to ATTR_PARENT_OPERATORS
const ATTR_ANCESTOR_OPERATORS = ['_or'];

// Can be used with values that are enums
const ENUM_OPERATORS = ['_eq', '_neq', '_in', '_nin'];

module.exports = {
  getOperator,
  PARENT_OPERATORS,
  DEEP_OPERATORS,
  ATTR_PARENT_OPERATORS,
  ATTR_ANCESTOR_OPERATORS,
  ENUM_OPERATORS,
};
