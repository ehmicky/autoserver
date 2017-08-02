'use strict';

const { omit } = require('../../../utilities');

// Defaults `type` for nested attributes, or normal attributes
const addAttrDefaultType = function (attr) {
  if (attr.type) { return attr; }

  return { ...attr, type: 'string' };
};

// From `type: string[]` or `type: my_model`
// to `type: string, multiple: true` or `model: my_model, multiple: false`
const normalizeType = function (attr) {
  const [, rawType, brackets] = typeRegExp.exec(attr.type);
  const multiple = brackets !== undefined;
  const isModel = !nonModelTypes.includes(rawType);

  const attrA = { ...attr, type: rawType, model: rawType, multiple };
  const attrB = isModel ? omit(attrA, 'type') : omit(attrA, 'model');

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
  addAttrDefaultType,
  normalizeType,
};
