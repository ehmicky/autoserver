'use strict';

const isObjectType = function (val) {
  return typeof val === 'object' && val !== null;
};

module.exports = {
  isObjectType,
};
