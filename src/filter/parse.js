'use strict';

const { assignArray } = require('../utilities');

const { getThrowErr } = require('./error');
const { getOperator, DEEP_OPERATORS } = require('./operators');
const { optimizeFilter } = require('./optimize');

// Parse `args.filter` and `model.authorize` format
// Syntax:
//  [                       // Filter. Top-level is either `_or` or `_and`
//    {                     // Attrs
//      attribute_name: 5   // Can use shortcut
//      attribute_name: {   // Name+value: Attr. Value only: Operations
//        _eq: 5,           // Operation
//        _neq: 4
//        _some: {
//          _eq: 3          // Recursive operation
//        }
//      }
//    }
//  ]
const parseFilter = function ({
  filter,
  reason = 'INPUT_VALIDATION',
  prefix = '',
}) {
  if (filter == null) { return; }

  // Top-level array means `_or` alternatives
  const type = Array.isArray(filter) ? '_or' : '_and';

  const throwErr = getThrowErr.bind(null, { reason, prefix });

  const filterA = parseOperation({ type, value: filter, throwErr });

  const filterB = optimizeFilter({ filter: filterA });

  return filterB;
};

const parseAttrs = function ({ attrs, throwErr }) {
  if (!attrs || attrs.constructor !== Object) {
    const message = 'There should be an object containing the filter attributes';
    throwErr(message);
  }

  return Object.entries(attrs)
    .map(([attrName, attrVal]) => parseAttr({ attrName, attrVal, throwErr }))
    .reduce(assignArray, []);
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
  parseFilter,
};
