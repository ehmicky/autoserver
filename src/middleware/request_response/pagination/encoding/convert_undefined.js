'use strict';

// Make sure undefined and null compare the same
const convertUndefined = function (token) {
  const parts = token.parts.map(value => (value === undefined ? null : value));
  return { ...token, parts };
};

module.exports = {
  convertUndefined,
};
