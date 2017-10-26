'use strict';

const { assignObject } = require('../../../../../utilities');

// Transform `args.filter` into MongoDB query object
// Applied recursively
const getQueryFilter = function ({ type, value, attrName }) {
  // No filter
  if (type === undefined) { return {}; }

  return operations[type]({ type, value, attrName });
};

const orOperation = function ({ value }) {
  const nodes = value.map(getQueryFilter);
  return { $or: nodes };
};

const andOperation = function ({ value }) {
  const nodes = value.map(getQueryFilter);
  return { $and: nodes };
};

const someOperation = function ({ value, attrName }) {
  const elemMatch = value
    .map(node => getGenericNode({ ...node, key: 'opName' }))
    .reduce(assignObject, {});
  return { [attrName]: { $elemMatch: elemMatch } };
};

const allOperation = function ({ value, attrName }) {
  const elemMatch = value
    .map(node => getGenericNode({ ...node, key: 'inverse' }))
    .reduce(assignObject, {});
  return { [attrName]: { $not: { $elemMatch: elemMatch } } };
};

const genericOperation = function ({ type, value, attrName }) {
  const valueA = getGenericNode({ type, value, key: 'opName' });
  return { [attrName]: valueA };
};

const getGenericNode = function ({ type, value, key }) {
  const { [key]: name, kind } = OPERATIONS_MAP[type];
  const valueA = kind === 'regexp' ? new RegExp(value) : value;
  return { [name]: valueA };
};

const OPERATIONS_MAP = {
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

const operations = {
  or: orOperation,
  and: andOperation,
  some: someOperation,
  all: allOperation,
  eq: genericOperation,
  neq: genericOperation,
  gt: genericOperation,
  gte: genericOperation,
  lt: genericOperation,
  lte: genericOperation,
  in: genericOperation,
  nin: genericOperation,
  like: genericOperation,
  nlike: genericOperation,
};

module.exports = {
  getQueryFilter,
};
