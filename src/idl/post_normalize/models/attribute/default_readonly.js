'use strict';

// Set `attr.readonly` to true if `attr.compute` is defined
const addAttrDefaultReadonly = function (attr) {
  if (attr.compute === undefined || attr.readonly) { return attr; }

  return { ...attr, readonly: true };
};

module.exports = {
  addAttrDefaultReadonly,
};
