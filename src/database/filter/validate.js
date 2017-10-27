'use strict';

const { fullRecurseMap } = require('../../utilities');
const { isInlineFunc } = require('../../schema_func');

const { getThrowErr } = require('./error');
const { getOperator, DEEP_OPERATIONS } = require('./operators');
const { validators } = require('./validators');

// `attrs` must be `{ model: { attrName:
// { type: 'string|number|integer|boolean', isArray: true|false } } }`
const validateFilter = function ({
  filter,
  attrs,
  reason = 'INPUT_VALIDATION',
  prefix = '',
  skipInlineFuncs,
}) {
  if (filter == null) { return; }

  const throwErr = getThrowErr.bind(null, { reason, prefix });

  fullRecurseMap(
    filter,
    node => recurseNode({ node, attrs, skipInlineFuncs, throwErr }),
  );
};

const recurseNode = function ({ node, attrs, skipInlineFuncs, throwErr }) {
  validateNode({ node, attrs, skipInlineFuncs, throwErr });

  return node;
};

const validateNode = function ({ node, attrs, skipInlineFuncs, throwErr }) {
  const operator = getOperator({ node });
  // Is not a node
  if (operator === undefined) { return; }

  const { type, value, attrName } = node;
  // E.g. 'and' and 'or' nodes
  if (attrName === undefined) { return; }

  const attr = getDeepAttr({ attrs, attrName, throwErr });

  const throwErrA = throwErr.bind(null, attrName);

  validateValue({
    type,
    value,
    attr,
    operator,
    skipInlineFuncs,
    throwErr: throwErrA,
  });
};

// In `{ attribute: { some: { eq: value } } }`, `eq` is considered deep
const getDeepAttr = function ({ attrs, attrName, throwErr }) {
  const [, attrNameA, , deepType] = DEEP_TYPE_REGEXP.exec(attrName) || [];
  const isDeep = DEEP_OPERATIONS.includes(deepType);

  const attr = getAttr({ attrs, attrName: attrNameA, throwErr });

  return isDeep ? { ...attr, isArray: false } : attr;
};

// Matches '$attrName some|all' -> ['$attrName', 'some|all']
const DEEP_TYPE_REGEXP = /^([^ ]*)( (.*))?$/;

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
  const [, deepAttr] = DYNAMIC_ATTR_REGEXP.exec(attrName) || [];
  if (deepAttr === undefined) { return; }

  const attr = attrs[deepAttr];

  const isDynamic = attr !== undefined && attr.type === 'dynamic';
  if (!isDynamic) { return; }

  return attr;
};

// Transform e.g. $params.var to ['$params']
const DYNAMIC_ATTR_REGEXP = /^(\$[a-zA-Z]+)\./;

const validateValue = function ({
  type,
  value,
  attr,
  operator,
  skipInlineFuncs,
  throwErr,
}) {
  // Skip schema functions
  // If one wants to validate them, they need to be evaluated first
  if (skipInlineFuncs && isInlineFunc({ inlineFunc: value })) { return; }

  const { validate } = operator;

  if (validate !== undefined) {
    validate({ type, value, attr, throwErr });
  }

  const { validation } = attr;

  if (validation) {
    Object.entries(validation).forEach(([keyword, ruleVal]) =>
      validators[keyword]({ type, value, ruleVal, throwErr }));
  }
};

module.exports = {
  validateFilter,
  getOperator,
};
