'use strict';


const { mapValues } = require('lodash');

const { EngineError } = require('../../error');


const handleJsl = async function () {
  return await function (input) {
    const { args } = input;
    args.filter = processJsl({ value: args.filter });

    const response = this.next(input);
    return response;
  };
};

// Transform value if it is JSL, otherwise returns as is
const processJsl = function ({ value }) {
  if (!value) { return value; }

  // Recursion over objects and arrays
  if (value.constructor === Object) {
    return mapValues(value, child => processJsl({ value: child }));
  }
  if (value instanceof Array) {
    return value.map(child => processJsl({ value: child }));
  }

  // Process anything that contains $variables
  if (!testJsl({ value })) { return value; }

  const context = getContext();

  try {
    value = evalJsl({ value, context });
  } catch (innererror) {
    throw new EngineError(`JSL expression evaluation failed: ${value}`, { reason: 'JSL_SYNTAX', innererror });
  }
  return value;
};

// Looks for unescaped `$` to find $variables
const jslRegExp = /(((?:[^\\])\$)|(^\$))/g;
// Test whether a value looks like JSL
const testJsl = ({ value }) => typeof value === 'string' && jslRegExp.test(value);

// Execute JSL statements
const evalJsl = function ({ value, context }) {
  /* eslint-disable no-unused-vars */
  const $ = context;
  /* eslint-enable no-unused-vars */

  // Replace $var by $.var
  value = value.replace(jslRegExp, '$1.');

  // Beware local (and global) variables are available inside eval(), i.e. must keep it to a minimal
  // TODO: this is highly insecure. E.g. value 'while (true) {}' would freeze the whole server. Also it has access to
  // global variables, including global.process. Problem is that alternatives are much slower, so we need to find a solution.
  const newValue = eval(value);
  return newValue;
};

// Values available as `$variable` in JSL
const getContext = function () {
  const context = {};
  context.now = (new Date()).toISOString();
  return context;
};


module.exports = {
  handleJsl,
};
