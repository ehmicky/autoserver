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
  _eq: { opName: '$eq', inverse: '$ne' },
  _neq: { opName: '$ne', inverse: '$eq' },
  _gt: { opName: '$gt', inverse: '$lte' },
  _gte: { opName: '$gte', inverse: '$lt' },
  _lt: { opName: '$lt', inverse: '$gte' },
  _lte: { opName: '$lte', inverse: '$gt' },
  _in: { opName: '$in', inverse: '$nin' },
  _nin: { opName: '$nin', inverse: '$in' },
  _like: { opName: '$regex', inverse: '$not', kind: 'regexp' },
  _nlike: { opName: '$not', inverse: '$regex', kind: 'regexp' },
};

const operators = {
  _or: orOperator,
  _and: andOperator,
  _some: someOperator,
  _all: allOperator,
  _eq: genericOperator,
  _neq: genericOperator,
  _gt: genericOperator,
  _gte: genericOperator,
  _lt: genericOperator,
  _lte: genericOperator,
  _in: genericOperator,
  _nin: genericOperator,
  _like: genericOperator,
  _nlike: genericOperator,
};

module.exports = {
  getQueryFilter,
};
