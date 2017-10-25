'use strict';

const { decapitalize } = require('underscore.string');

const { assignArray } = require('../../utilities');
const { throwError } = require('../../error');

const { parseAttributes } = require('./attr');

// Parse `args.filter` and `model.authorize` format
// `attrs` must be `{ model: { attrName:
// { type: 'string|number|integer|boolean', isArray: true|false } } }`
const parseFilter = function ({
  filter,
  attrs,
  reason = 'INPUT_VALIDATION',
  prefix = '',
}) {
  if (filter == null) { return; }

  const throwErr = getThrowErr.bind(null, { reason, prefix });

  // Top-level array means 'or' alternatives
  return Array.isArray(filter)
    ? parseOrNode({ nodes: filter, attrs, throwErr })
    : parseAndNode({ node: filter, attrs, throwErr });
};

const getThrowErr = function ({ reason, prefix }, extraPrefix, message = '') {
  const messageA = `${prefix}${decapitalize(extraPrefix)}${decapitalize(message)}`;
  throwError(messageA, { reason });
};

const parseOrNode = function ({ nodes, attrs, throwErr }) {
  const value = nodes
    .map(node => parseAndNode({ node, attrs, throwErr }))
    .filter(val => val !== undefined);
  return getLogicNode({ value, type: 'or' });
};

const parseAndNode = function ({ node, attrs, throwErr }) {
  const value = Object.entries(node)
    .map(([attrName, attrVal]) => parseOperation({
      attrName,
      attrVal,
      attrs,
      throwErr,
    }))
    .reduce(assignArray, []);
  return getLogicNode({ value, type: 'and' });
};

// 'and' and 'or' nodes
const getLogicNode = function ({ value, type }) {
  // E.g. when using an empty object or empty array
  if (value.length === 0) { return; }

  // No need for 'and|or' if there is only one filter
  if (value.length === 1) { return value[0]; }

  return { type, value };
};

const parseOperation = function ({ attrName, attrVal, attrs, throwErr }) {
  const attr = getAttr({ attrs, attrName, throwErr });

  const value = parseAttributes({ attrVal, attrName, attr, throwErr })
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

module.exports = {
  parseFilter,
};
