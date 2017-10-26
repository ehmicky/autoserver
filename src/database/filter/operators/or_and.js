'use strict';

const { assignArray } = require('../../../utilities');

const parseOr = function ({ nodes, attrs, throwErr, parseAttrs }) {
  const value = nodes
    .map(node => parseAnd({ node, attrs, throwErr, parseAttrs }))
    .filter(val => val !== undefined);
  return getLogicNode({ value, type: 'or' });
};

const parseAnd = function ({ node, attrs, throwErr, parseAttrs }) {
  const value = Object.entries(node)
    .map(([attrName, attrVal]) => parseNode({
      attrName,
      attrVal,
      attrs,
      throwErr,
      parseAttrs,
    }))
    .reduce(assignArray, []);
  return getLogicNode({ value, type: 'and' });
};

const parseNode = function ({
  attrName,
  attrVal,
  attrs,
  throwErr,
  parseAttrs,
}) {
  const attr = getAttr({ attrs, attrName, throwErr });

  const throwErrA = throwErr.bind(null, `For '${attrName}', `);

  const value = parseAttrs({ attrVal, attrName, attr, throwErr: throwErrA })
    .map(node => ({ ...node, attrName }));
  return value;
};

const getAttr = function ({ attrs, attrName, throwErr }) {
  const attr = attrs[attrName];
  if (attr !== undefined) { return attr; }

  const dynamicAttr = getDynamicAttr({ attrs, attrName });
  if (dynamicAttr !== undefined) { return dynamicAttr; }

  const message = `Must not use unknown '${attrName}'`;
  throwErr(message);
};

// E.g. $params and $args do not validate deep members
const getDynamicAttr = function ({ attrs, attrName }) {
  const [, deepAttr] = DEEP_ATTR_REGEXP.exec(attrName) || [];
  if (deepAttr === undefined) { return; }

  const attr = attrs[deepAttr];
  const isDynamic = attr !== undefined && attr.type === 'dynamic';

  if (!isDynamic) { return; }

  return attr;
};

// Transform e.g. $params.var to ['$params']
const DEEP_ATTR_REGEXP = /^(\$[a-zA-Z]+)\./;

// 'and' and 'or' nodes
const getLogicNode = function ({ value, type }) {
  // E.g. when using an empty object or empty array
  if (value.length === 0 && type === 'or') { return; }

  // No need for 'and|or' if there is only one filter
  if (value.length === 1) { return value[0]; }

  return { type, value };
};

// Matcher for bother 'and' and 'or' operators
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
  parseOr,
  parseAnd,
  evalOr,
  evalAnd,
};
