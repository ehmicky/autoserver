'use strict';

// `_slicestr` patch operator
const sliceOperator = {
  attribute: ['string'],

  argument: ['integer[]'],

  check ({ $arg: opVal }) {
    if (opVal.length <= 2) { return; }

    return 'the argument must be an array with one integer (the index) and an optional additional integer (the length)';
  },

  apply ({ $val: attrVal, $arg: [index, length] }) {
    return attrVal.substr(index, length);
  },
};

// `_insertstr` patch operator
const insertOperator = {
  attribute: ['string'],

  argument: ['integer[]', 'string[]'],

  check ({ $arg: opVal }) {
    const isValid = opVal.length === 2 &&
      Number.isInteger(opVal[0]) &&
      typeof opVal[1] === 'string';
    if (isValid) { return; }

    return 'the argument must be an array with one integer (the index) and a string';
  },

  apply ({ $val: attrVal, $arg: [index, str] }) {
    const indexA = index < 0 ? Math.max(attrVal.length + index, 0) : index;
    const beginning = attrVal.substr(0, indexA);
    const end = attrVal.substr(indexA);
    return `${beginning}${str}${end}`;
  },
};

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

  apply ({ $val: attrVal, $arg: [regExp, str, flags] }) {
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
  _slicestr: sliceOperator,
  _insertstr: insertOperator,
  _replace: replaceOperator,
};
