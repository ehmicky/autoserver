'use strict';

const { isInlineFunc } = require('../../schema_func');
const { crawlAttrs } = require('../crawl');
const { getThrowErr } = require('../error');
const { getOperator } = require('../operators');

const { getDeepAttr } = require('./attr');
const { getSiblingValue } = require('./siblings');
const { validators } = require('./validators');

// `attrs` must be `{ collname: { attrName:
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

  crawlAttrs(
    filter,
    nodes => validateAttr({ nodes, attrs, skipInlineFuncs, throwErr }),
  );
};

const validateAttr = function ({ nodes, ...rest }) {
  nodes.forEach(node => validateNode({ node, operations: nodes, ...rest }));
};

const validateNode = function ({
  node,
  node: { type, attrName },
  operations,
  attrs,
  skipInlineFuncs,
  throwErr,
}) {
  const operator = getOperator({ node });

  const attr = getDeepAttr({ attrs, attrName, throwErr });

  const throwErrA = throwErr.bind(null, attrName);

  const valueA = getSiblingValue({ node, attrs, throwErr: throwErrA });

  validateValue({
    type,
    value: valueA,
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
  attr: { validation: attrValidate },
  operator: { validate: opValidate },
  operations,
  skipInlineFuncs,
  throwErr,
}) {
  // Skip schema functions
  // If one wants to validate them, they need to be evaluated first
  if (skipInlineFuncs && isInlineFunc({ inlineFunc: value })) { return; }

  if (opValidate !== undefined) {
    opValidate({ type, value, attr, throwErr });
  }

  if (attrValidate) {
    Object.entries(attrValidate)
      .forEach(([keyword, ruleVal]) => validators[keyword]({
        type,
        value,
        ruleVal,
        validation: attrValidate,
        operations,
        throwErr,
      }));
  }
};

module.exports = {
  validateFilter,
};
