'use strict';

const orAnd = require('./or_and');
const someAll = require('./some_all');
const eqNeq = require('./eq_neq');
const ltGtLteGte = require('./lt_gt_lte_gte');
const inNin = require('./in_nin');
const likeNlike = require('./like_nlike');

const operators = {
  ...orAnd,
  ...someAll,
  ...eqNeq,
  ...ltGtLteGte,
  ...inNin,
  ...likeNlike,
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

// Cannot use siblings `model.ATTR`
// This is because this would require parsing sibling value as RegExp during
// query time, which is slow and prone to fail
// For deep operators, it is sometimes quite complicated to implement in
// database adapters. E.g. MongoDB does not allow $where inside $elemMatch
const NO_SIBLINGS_OPERATORS = ['_like', '_nlike', '_some', '_all'];

module.exports = {
  getOperator,
  PARENT_OPERATORS,
  DEEP_OPERATORS,
  ATTR_PARENT_OPERATORS,
  ATTR_ANCESTOR_OPERATORS,
  ENUM_OPERATORS,
  NO_SIBLINGS_OPERATORS,
};
