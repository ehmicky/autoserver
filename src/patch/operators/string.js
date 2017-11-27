'use strict';

// `_replace` patch operator
const replaceOperator = {
  attribute: ['string'],

  argument: ['string[]'],

  check ({ $arg: opVal }) {
    // eslint-disable-next-line no-magic-numbers
    const isValid = opVal.length <= 3 && opVal.length >= 2;

    if (!isValid) {
      return 'the argument must be an array with one regular expression, then a string, then an optional list of flags';
    }

    return validateRegExp({ opVal });
  },

  apply ({ $val: attrVal = '', $arg: [regExp, str, flags] }) {
    const regExpA = getRegExp({ regExp, flags });
    return attrVal.replace(regExpA, str);
  },
};

const validateRegExp = function ({ opVal }) {
  const [regExp, , flags] = opVal;

  try {
    getRegExp({ regExp, flags });

    return;
  } catch (error) {}

  try {
    getRegExp({ regExp });

    return 'the regular expression\'s flags are invalid';
  } catch (error) {
    return 'the regular expression is invalid';
  }
};

const getRegExp = function ({ regExp, flags = 'gi' }) {
  return new RegExp(regExp, flags);
};

module.exports = {
  _replace: replaceOperator,
};
