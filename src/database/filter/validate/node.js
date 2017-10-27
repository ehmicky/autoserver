'use strict';

const { isInlineFunc } = require('../../../schema_func');
const { getOperator } = require('../operators');

const { getDeepAttr } = require('./attr');
const { validators } = require('./validators');

const validateNode = function ({
  node,
  attrs,
  parent,
  grandParent,
  skipInlineFuncs,
  throwErr,
}) {
  const operator = getOperator({ node });
  // Is not a node
  if (operator === undefined) { return; }

  const { type, value, attrName } = node;
  // E.g. 'and' and 'or' nodes
  if (attrName === undefined) { return; }

  const operations = getOperations({ node, parent, grandParent });

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

// Get `and` siblings on the same attribute
const getOperations = function ({ node, parent, grandParent }) {
  const isAlone = parent === undefined ||
    grandParent === undefined ||
    grandParent.type !== 'and';
  if (isAlone) { return [node]; }

  return parent.filter(({ attrName }) => attrName === node.attrName);
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
  validateNode,
};
