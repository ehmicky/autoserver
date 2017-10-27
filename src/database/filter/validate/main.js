'use strict';

const { fullRecurseMap } = require('../../../utilities');
const { getThrowErr } = require('../error');
const { getOperator } = require('../operators');

const { validateNode } = require('./node');

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
    (node, name, { parent, grandParent }) => recurseNode({
      node,
      attrs,
      parent,
      grandParent,
      skipInlineFuncs,
      throwErr,
    }),
  );
};

const recurseNode = function ({ node, ...rest }) {
  validateNode({ node, ...rest });

  return node;
};

module.exports = {
  validateFilter,
  getOperator,
};
