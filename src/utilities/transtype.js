'use strict';


/**
 * Tries to guess a value's type from its string serialized value
 *
 * @param string {string}
 * @param value {string|integer|float|boolean}
 */
const transtype = function (string) {
  if (typeof string !== 'string') { return string; }

  const parsedNumber = Number.parseFloat(string);
  if (parsedNumber) { return parsedNumber; }

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