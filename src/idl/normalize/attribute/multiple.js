'use strict';

const addAttrDefaultMultiple = function ({ multiple }) {
  if (typeof multiple === 'boolean') { return; }

  return { multiple: false };
};

module.exports = {
  addAttrDefaultMultiple,
};
