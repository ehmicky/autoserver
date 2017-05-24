'use strict';


/**
 * Tries to guess a value's type from its string serialized value
 *
 * @param {string} string
 * @param {string|integer|float|boolean} value
 */
const transtype = function (string) {
  if (typeof string !== 'string') { return string; }

  const parsedNumber = Number.parseFloat(string);
  const isValidNumber = typeof parsedNumber === 'number' &&
    Number.isFinite(parsedNumber);
  if (isValidNumber) { return parsedNumber; }

  const normalizedString = string.toLowerCase().trim();
  switch (normalizedString) {
    case 'true':
      return true;
    case 'false':
      return false;
  }

  return string;
};


module.exports = {
  transtype,
};
