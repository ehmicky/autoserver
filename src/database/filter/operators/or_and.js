'use strict';

const { assignArray } = require('../../../utilities');

const parseOr = function ({ value, parseOperations, throwErr }) {
  return value
    .map(and => parseOperations({ operations: { and }, throwErr }))
    .reduce(assignArray, []);
};

const parseAnd = function ({ value, parseAttrs, throwErr }) {
  return parseAttrs({ attrs: value, throwErr });
};

const optimizeOr = function (node) {
  const { value } = node;

  // If some alternatives is already true, whole node is true
  const hasTrue = value.some(val => val == null);
  if (hasTrue) { return; }

  // When using an empty array
  if (value.length === 0) { return; }

  // No need for 'or' if there is only one filter
  if (value.length === 1) { return value[0]; }

  return node;
};

const optimizeAnd = function (node) {
  const { value } = node;

  // Remove alternatives that are already true
  const valueA = value.filter(val => val != null);

  // When using an empty object
  if (valueA.length === 0) { return; }

  // No need for 'and' if there is only one filter
  if (valueA.length === 1) { return valueA[0]; }

  return { ...node, value: valueA };
};

const evalOrAnd = function (
  operator,
  { attrs, value, partialNames, evalFilter },
) {
  const operatorMap = andOrMap[operator];

  const valueA = value
    .map(filter => evalFilter({ attrs, filter, partialNames }));

  const hasSomeFalse = valueA.some(val => val === operatorMap.some);
  if (hasSomeFalse) { return operatorMap.some; }

  const valueB = valueA.filter(val => typeof val !== 'boolean');
  const hasPartialNodes = valueB.length > 0;

  if (hasPartialNodes) {
    return simplifyNode({ type: operator, value: valueB });
  }

  return operatorMap.every;
};

// Try to simplify a node when possible
const simplifyNode = function (node) {
  if (node.value.length === 1) { return node.value[0]; }

  return node;
};

const andOrMap = {
  and: { some: false, every: true },
  or: { some: true, every: false },
};

// Top-level array
const evalOr = evalOrAnd.bind(null, 'or');

// Several fields inside a filter object
const evalAnd = evalOrAnd.bind(null, 'and');

module.exports = {
  or: {
    parse: parseOr,
    optimize: optimizeOr,
    eval: evalOr,
  },
  and: {
    parse: parseAnd,
    optimize: optimizeAnd,
    eval: evalAnd,
  },
};
