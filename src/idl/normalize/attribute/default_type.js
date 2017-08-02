'use strict';

// Defaults `type` for nested attributes, or normal attributes
const addAttrDefaultType = function (attr) {
  if (attr.type) { return attr; }

  return { ...attr, type: 'string' };
};

module.exports = {
  addAttrDefaultType,
};
