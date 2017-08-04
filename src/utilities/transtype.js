'use strict';

// Tries to guess a value's type from its string serialized value
// @param {string} string
// @param {string|integer|float|boolean} value
const transtype = function (string) {
  if (typeof string !== 'string') { return string; }

  const number = parseNumber(string);
  if (number !== undefined) { return number; }

  const boolean = parseBoolean(string);
  if (boolean !== undefined) { return boolean; }

  return string;
};

const parseNumber = function (string) {
  const parsedNumber = Number(string);

  const isValidNumber = typeof parsedNumber === 'number' &&
    Number.isFinite(parsedNumber);
  if (!isValidNumber) { return; }

  return parsedNumber;
};

const parseBoolean = function (string) {
  if (string === 'true') { return true; }
  if (string === 'false') { return false; }
};

module.exports = {
  transtype,
};
