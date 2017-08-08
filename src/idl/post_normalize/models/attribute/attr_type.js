'use strict';

const { omit } = require('../../../../utilities');

// From `type: string[]` or `type: my_model`
// to `type: string, isArray: true` or `target: my_model, isArray: false`
const normalizeType = function (attr) {
  const [, rawType, brackets] = typeRegExp.exec(attr.type);
  const isArray = brackets !== undefined;
  const isModel = !nonModelTypes.includes(rawType);

  const attrA = { ...attr, type: rawType, target: rawType, isArray };
  const attrB = isModel ? omit(attrA, 'type') : omit(attrA, 'target');

  return attrB;
};

// Parse 'type[]' to ['type', '[]'] and 'type' to ['type', '']
const typeRegExp = /([^[]*)(\[\])?$/;

const nonModelTypes = [
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
