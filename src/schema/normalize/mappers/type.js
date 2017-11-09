'use strict';

const { omit } = require('../../../utilities');

// From `type: string[]` or `type: my_coll`
// to `type: string, isArray: true` or `target: my_coll, isArray: false`
const normalizeType = function (attr) {
  const [, rawType, brackets] = TYPE_REGEXP.exec(attr.type);
  const isArray = brackets !== undefined;
  const isColl = !NON_COLL_TYPES.includes(rawType);

  const attrA = { ...attr, type: rawType, target: rawType, isArray };
  const attrB = isColl ? omit(attrA, 'type') : omit(attrA, 'target');

  return attrB;
};

// Parse 'type[]' to ['type', '[]'] and 'type' to ['type', '']
const TYPE_REGEXP = /([^[]*)(\[\])?$/;

const NON_COLL_TYPES = [
  'array',
  'object',
  'string',
  'number',
  'integer',
  'null',
  'boolean',
];

module.exports = {
  normalizeType,
};
