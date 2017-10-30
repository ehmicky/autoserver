'use strict';

const { assignObject } = require('../../../../../utilities');

// Transform `args.filter` into MongoDB query object
// Applied recursively
const getQueryFilter = function ({ type, value, attrName }) {
  // No filter
  if (type === undefined) { return {}; }

  return operators[type]({ type, value, attrName });
};

const orOperator = function ({ value }) {
  const nodes = value.map(getQueryFilter);
  return { $or: nodes };
};

const andOperator = function ({ value }) {
  const nodes = value.map(getQueryFilter);
  return { $and: nodes };
};

const someOperator = function ({ value, attrName }) {
  const elemMatch = value
    .map(node => getGenericNode({ ...node, key: 'opName' }))
    .reduce(assignObject, {});
  return { [attrName]: { $elemMatch: elemMatch } };
};

const allOperator = function ({ value, attrName }) {
  const elemMatch = value
    .map(node => getGenericNode({ ...node, key: 'inverse' }))
    .reduce(assignObject, {});
  return { [attrName]: { $not: { $elemMatch: elemMatch } } };
};

const genericOperator = function ({ type, value, attrName }) {
  const valueA = getGenericNode({ type, value, key: 'opName' });
  return { [attrName]: valueA };
};

const getGenericNode = function ({ type, value, key }) {
  const { [key]: name, kind } = OPERATORS_MAP[type];
  const valueA = kind === 'regexp' ? new RegExp(value, 'i') : value;
  return { [name]: valueA };
};

const OPERATORS_MAP = {
  eq: { opName: '$eq', inverse: '$ne' },
  neq: { opName: '$ne', inverse: '$eq' },
  gt: { opName: '$gt', inverse: '$lte' },
  gte: { opName: '$gte', inverse: '$lt' },
  lt: { opName: '$lt', inverse: '$gte' },
  lte: { opName: '$lte', inverse: '$gt' },
  in: { opName: '$in', inverse: '$nin' },
  nin: { opName: '$nin', inverse: '$in' },
  like: { opName: '$regex', inverse: '$not', kind: 'regexp' },
  nlike: { opName: '$not', inverse: '$regex', kind: 'regexp' },
};

const operators = {
  or: orOperator,
  and: andOperator,
  some: someOperator,
  all: allOperator,
  eq: genericOperator,
  neq: genericOperator,
  gt: genericOperator,
  gte: genericOperator,
  lt: genericOperator,
  lte: genericOperator,
  in: genericOperator,
  nin: genericOperator,
  like: genericOperator,
  nlike: genericOperator,
};

module.exports = {
  getQueryFilter,
};
