'use strict';

// Make sure undefined and null compare the same
const convertUndefined = function (token) {
  const partsA = token.parts.map(value => (value === undefined ? null : value));
  return { ...token, parts: partsA };
};

module.exports = {
  convertUndefined,
};
