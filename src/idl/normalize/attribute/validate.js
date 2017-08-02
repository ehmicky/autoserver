'use strict';

// Set attr.validate to {} if undefined
const addAttrDefaultValidate = function (attr) {
  if (attr.validate) { return attr; }

  return { ...attr, validate: {} };
};

module.exports = {
  addAttrDefaultValidate,
};
