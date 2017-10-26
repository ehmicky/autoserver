'use strict';

const { decapitalize, capitalize } = require('underscore.string');

const { throwError } = require('../../error');

const { operators } = require('./operators');
const { parseAttrs } = require('./attr');

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
  const node = Array.isArray(filter)
    ? operators.or.parse({ nodes: filter, attrs, throwErr, parseAttrs })
    : operators.and.parse({ node: filter, attrs, throwErr, parseAttrs });
  return node;
};

const getThrowErr = function ({ reason, prefix }, extraPrefix, message = '') {
  const messageA = `${prefix}${decapitalize(extraPrefix)}${decapitalize(message)}`;
  const messageB = capitalize(messageA);
  throwError(messageB, { reason });
};

module.exports = {
  parseFilter,
};
