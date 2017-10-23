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
    .map(getGenericNode)
    .reduce(assignObject, {});
  return { [attrName]: { $elemMatch: elemMatch } };
};

const allOperation = function ({ value, attrName }) {
  const elemMatch = value
    .map(node => ({ [operationsMap[node.type].inverse]: node.value }))
    .reduce(assignObject, {});
  return { [attrName]: { $not: { $elemMatch: elemMatch } } };
};

const genericOperation = function ({ type, value, attrName }) {
  const node = getGenericNode({ type, value });
  return { [attrName]: node };
};

const getGenericNode = function ({ type, value }) {
  const { opName } = operationsMap[type];
  return { [opName]: value };
};

const operationsMap = {
  eq: { opName: '$eq', inverse: '$ne' },
  neq: { opName: '$ne', inverse: '$eq' },
  gt: { opName: '$gt', inverse: '$lte' },
  gte: { opName: '$gte', inverse: '$lt' },
  lt: { opName: '$lt', inverse: '$gte' },
  lte: { opName: '$lte', inverse: '$gt' },
  in: { opName: '$in', inverse: '$nin' },
  nin: { opName: '$nin', inverse: '$in' },
  like: { opName: '$regex', inverse: '$not' },
  nlike: { opName: '$not', inverse: '$regex' },
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
