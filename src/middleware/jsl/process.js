'use strict';


const { mapValues } = require('lodash');

const { isJsl, isEscapedJsl, getRawJsl } = require('./test');


// Transform value if it is JSL using supplied processor, otherwise returns as is
const processJsl = function ({ value, name, variables, processor, removeEscape = true }) {
  if (!value) { return value; }

  // Recursion over objects and arrays
  if (value.constructor === Object) {
    return mapValues(value, (child, childName) => processJsl({ value: child, name: childName, variables, processor }));
  }
  if (value instanceof Array) {
    return value.map(child => processJsl({ value: child, name, variables, processor }));
  }

  // If this is not JSL, abort
  if (!isJsl({ value })) {
    // Can escape (...) from being interpreted as JSL by escaping first parenthesis
    if (removeEscape && isEscapedJsl({ value })) {
      value = value.replace('\\', '');
    }
    return value;
  }

  // Removes outer parenthesis
  value = getRawJsl({ value });

  value = processor({ value, name, variables });

  return value;
};


module.exports = {
  processJsl,
};
