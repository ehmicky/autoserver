'use strict';

// Defaults `type` for nested attributes, or normal attributes
const addAttrDefaultType = function ({ type }) {
  if (type) { return {}; }

  return { type: 'string' };
};

module.exports = {
  addAttrDefaultType,
};
