'use strict';

// Tries to guess a value's type from its string serialized value
// @param {string} string
// @param {string|integer|float|boolean} value
const transtype = function (string) {
  try {
    return JSON.parse(string);
  } catch (error) {
    return string;
  }
};

module.exports = {
  transtype,
};
