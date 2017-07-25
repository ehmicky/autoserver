'use strict';

// Default `model.type` to `object`
const addModelDefaultType = function ({ type }) {
  if (type) { return; }

  return { type: 'object' };
};

module.exports = {
  addModelDefaultType,
};
