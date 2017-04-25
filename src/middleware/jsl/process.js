'use strict';


const { mapValues } = require('lodash');

const { testJsl } = require('./test');


// Transform value if it is JSL using supplied processor, otherwise returns as is
const processJsl = function ({ value, name, variables, processor }) {
  if (!value) { return value; }

  // Recursion over objects and arrays
  if (value.constructor === Object) {
    return mapValues(value, (child, childName) => processJsl({ value: child, name: childName, variables, processor }));
  }
  if (value instanceof Array) {
    return value.map(child => processJsl({ value: child, name, variables, processor }));
  }

  // Process anything that contains $variables
  if (!testJsl({ value })) { return value; }

  value = processor({ value, name, variables });

  return value;
};


module.exports = {
  processJsl,
};
