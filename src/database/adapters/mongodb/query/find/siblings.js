'use strict';

// When using model.ATTR
const getSiblingNode = function ({
  type,
  value: { value: otherAttr },
  attrName,
}) {
  const text = WHERE_TEXTS[type]({ attrName, otherAttr });
  return { $where: text };
};

const WHERE_TEXTS = {
  _eq: ({ attrName, otherAttr }) => `this.${attrName} === this.${otherAttr}`,
  _neq: ({ attrName, otherAttr }) => `this.${attrName} !== this.${otherAttr}`,
  _gt: ({ attrName, otherAttr }) => `this.${attrName} > this.${otherAttr}`,
  _gte: ({ attrName, otherAttr }) => `this.${attrName} >= this.${otherAttr}`,
  _lt: ({ attrName, otherAttr }) => `this.${attrName} < this.${otherAttr}`,
  _lte: ({ attrName, otherAttr }) => `this.${attrName} <= this.${otherAttr}`,
  _in: ({ attrName, otherAttr }) => `Array.isArray(this.${otherAttr}) && this.${otherAttr}.includes(this.${attrName})`,
  _nin: ({ attrName, otherAttr }) => `!Array.isArray(this.${otherAttr}) || !this.${otherAttr}.includes(this.${attrName})`,
};

module.exports = {
  getSiblingNode,
};
