'use strict';

const addAttrDefaultValidate = function (attr) {
  if (attr.validate) { return; }

  return { validate: {} };
};

module.exports = {
  addAttrDefaultValidate,
};
