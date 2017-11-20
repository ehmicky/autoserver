'use strict';

const { flatten } = require('../../utilities');
const { getOperator, DEEP_OPERATORS } = require('../operators');

const parseAttrs = function ({ attrs, throwErr }) {
  if (!attrs || attrs.constructor !== Object) {
    const message = 'There should be an object containing the filter attributes';
    throwErr(message);
  }

  const nodes = Object.entries(attrs).map(([attrName, attrVal]) =>
    parseNestedAttr({ attrName, attrVal, throwErr }));
  const nodesA = flatten(nodes);
  return nodesA;
};

// Prepend `attrName.`, then recurse
const parseNestedAttrs = function ({ attrName, attrVal, throwErr }) {
  const nodes = Object.entries(attrVal)
    .map(([nestedNameA, nestedAttrVal]) => parseNestedAttr({
      attrName: `${attrName}.${nestedNameA}`,
      attrVal: nestedAttrVal,
      throwErr,
    }));
  const nodesA = flatten(nodes);
  return nodesA;
};

// `{ attribute: { child: value } }` is parsed as `{ attribute.child: value }`
const parseNestedAttr = function ({ attrName, attrVal, throwErr }) {
  const nestedName = findNestedAttr({ attrVal });

  // No nested attributes
  if (nestedName === undefined) {
    return parseAttr({ attrName, attrVal, throwErr });
  }

  // Cannot mix with operators,
  // e.g. `{ attribute: { child: value, _eq: value } }`
  const mixedOp = Object.keys(attrVal)
    .find(nestedAttrName => nestedAttrName.startsWith('_'));

  if (mixedOp !== undefined) {
    const message = `Cannot use operator '${mixedOp}' alongside attribute '${nestedName}'`;
    throwErr(message);
  }

  return parseNestedAttrs({ attrName, attrVal, throwErr });
};

const findNestedAttr = function ({ attrVal }) {
  if (typeof attrVal !== 'object') { return; }

  return Object.keys(attrVal)
    .find(nestedAttrName => !nestedAttrName.startsWith('_'));
};

const parseAttr = function ({ attrName, attrVal, throwErr }) {
  return parseOperations({ operations: attrVal, throwErr })
    .map(node => addAttrName({ node, attrName }));
};

const addAttrName = function ({ node: { type, value }, attrName }) {
  const valueA = addDeepAttrName({ type, value, attrName });
  return { type, value: valueA, attrName };
};

const addDeepAttrName = function ({ type, value, attrName }) {
  if (!DEEP_OPERATORS.includes(type)) { return value; }

  return value.map(node => ({ ...node, attrName: `${attrName} ${type}` }));
};

const parseOperations = function ({ operations, throwErr }) {
  const operationsA = getShortcut({ operations });

  return Object.entries(operationsA)
    .map(([type, value]) => parseOperation({ type, value, throwErr }));
};

// `{ attribute: value }` is a shortcut for `{ attribute: { _eq: value } }`
const getShortcut = function ({ operations }) {
  if (operations && operations.constructor === Object) { return operations; }

  return { _eq: operations };
};

const parseOperation = function ({ type, value, throwErr }) {
  const node = { type, value };
  const operator = getOperator({ node });

  if (operator === undefined) {
    const message = `Must not use unknown operator '${type}'`;
    throwErr(message);
  }

  // Normalize `null|undefined` to only `undefined`
  const valueA = value === null ? undefined : value;

  // Pass `parseAttrs` and `parseOperations` for recursion
  const valueB = operator.parse({
    value: valueA,
    parseAttrs,
    parseOperations,
    throwErr,
  });
  return { ...node, value: valueB };
};

module.exports = {
  parseOperation,
};
