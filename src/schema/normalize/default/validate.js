'use strict';

// Add default `attr.validate`
const addDefaultValidate = function (attr) {
  if (attr.validate) { return attr; }

  return { ...attr, validate: {} };
};

module.exports = {
  addDefaultValidate,
};
