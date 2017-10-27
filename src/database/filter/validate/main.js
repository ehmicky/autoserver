'use strict';

const { fullRecurseMap } = require('../../../utilities');
const { isInlineFunc } = require('../../../schema_func');
const { getThrowErr } = require('../error');
const { getOperator } = require('../operators');

const { getDeepAttr } = require('./attr');
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
    (node, name, parent) => recurseNode({
      node,
      attrs,
      parent,
      skipInlineFuncs,
      throwErr,
    }),
  );
};

const recurseNode = function ({ node, ...rest }) {
  validateNode({ node, ...rest });

  return node;
};

const validateNode = function ({
  node,
  attrs,
  parent,
  skipInlineFuncs,
  throwErr,
}) {
  const operator = getOperator({ node });
  // Is not a node
  if (operator === undefined) { return; }

  const { type, value, attrName } = node;
  // E.g. 'and' and 'or' nodes
  if (attrName === undefined) { return; }

  // All operations on that attribute, i.e. including `node`'s siblings
  const operations = parent === undefined ? [node] : parent;

  const attr = getDeepAttr({ attrs, attrName, throwErr });

  const throwErrA = throwErr.bind(null, attrName);

  validateValue({
    type,
    value,
    attr,
    operator,
    operations,
    skipInlineFuncs,
    throwErr: throwErrA,
  });
};

const validateValue = function ({
  type,
  value,
  attr,
  operator,
  operations,
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
    Object.entries(validation)
      .forEach(([keyword, ruleVal]) => validators[keyword]({
        type,
        value,
        ruleVal,
        validation,
        operations,
        throwErr,
      }));
  }
};

module.exports = {
  validateFilter,
  getOperator,
};
