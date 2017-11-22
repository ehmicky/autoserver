'use strict';

const { flatten } = require('../../utilities');
const { getOperator, DEEP_OPERATORS } = require('../operators');
const { parseSiblingNode } = require('../siblings');

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

  validateMixedOp({ nestedName, attrVal, throwErr });

  return parseNestedAttrs({ attrName, attrVal, throwErr });
};

const findNestedAttr = function ({ attrVal }) {
  if (typeof attrVal !== 'object') { return; }

  return Object.keys(attrVal)
    .find(nestedAttrName => !nestedAttrName.startsWith('_'));
};

// Cannot mix with operators,
// e.g. `{ attribute: { child: value, _eq: value } }`
const validateMixedOp = function ({ nestedName, attrVal, throwErr }) {
  const mixedOp = Object.keys(attrVal)
    .find(nestedAttrName => nestedAttrName.startsWith('_'));
  if (mixedOp === undefined) { return; }

  const message = `Cannot use operator '${mixedOp}' alongside attribute '${nestedName}'`;
  throwErr(message);
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

  const valueB = parseValue({ operator, value: valueA, throwErr });

  return { ...node, value: valueB };
};

const parseValue = function ({ operator, value, throwErr }) {
  const valueA = parseSiblingNode({ value, throwErr });
  if (valueA !== undefined) { return valueA; }

  // Pass `parseAttrs` and `parseOperations` for recursion
  return operator.parse({ value, parseAttrs, parseOperations, throwErr });
};

module.exports = {
  parseOperation,
};
