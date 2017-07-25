'use strict';

// Defaults `type` for nested attributes, or normal attributes
const addAttrDefaultType = function (attr) {
  if (attr.type) { return; }

  const type = getDefaultType(attr);
  return { type };
};

const getDefaultType = function ({ items }) {
  if (items) { return 'array'; }
  return 'string';
};

module.exports = {
  addAttrDefaultType,
};
