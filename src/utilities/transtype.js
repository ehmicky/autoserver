'use strict';

// Tries to guess a value's type from its string serialized value
// @param {string} string
// @param {string|integer|float|boolean} value
const transtype = function (string) {
  const number = parseNumber(string);
  if (number !== undefined) { return number; }

  const boolean = parseBoolean(string);
  if (boolean !== undefined) { return boolean; }

  return string;
};

const parseNumber = function (string) {
  if (typeof string !== 'string' || string === '') { return string; }

  const number = Number(string);

  const isValidNumber = typeof number === 'number' && Number.isFinite(number);
  if (!isValidNumber) { return; }

  return number;
};

const parseBoolean = function (string) {
  if (string === 'true') { return true; }
  if (string === 'false') { return false; }
};

module.exports = {
  transtype,
};
