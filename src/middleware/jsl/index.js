'use strict';


const { mapValues } = require('lodash');

const { EngineError } = require('../../error');


const handleJsl = async function () {
  return await function (input) {
    const { args, info: { ip }, params } = input;
    const contextInfo = { ip, params };
    if (args.filter) {
      args.filter = processJsl({ value: args.filter, contextInfo });
    }
    if (args.data) {
      args.data = processJsl({ value: args.data, contextInfo });
    }

    const response = this.next(input);
    return response;
  };
};

// Transform value if it is JSL, otherwise returns as is
const processJsl = function ({ value, contextInfo }) {
  if (!value) { return value; }

  // Recursion over objects and arrays
  if (value.constructor === Object) {
    return mapValues(value, child => processJsl({ value: child, contextInfo }));
  }
  if (value instanceof Array) {
    return value.map(child => processJsl({ value: child, contextInfo }));
  }

  // Process anything that contains $variables
  if (!testJsl({ value })) { return value; }

  const context = getContext(contextInfo);

  try {
    value = evalJsl({ value, context });
  } catch (innererror) {
    throw new EngineError(`JSL expression evaluation failed: ${value}`, { reason: 'JSL_SYNTAX', innererror });
  }
  return value;
};

// Looks for unescaped `$` to find $variables
const jslRegExp = /((?:(?:[^\\])\$)|(?:^\$))([^{]|$)/g;
// Test whether a value looks like JSL
const testJsl = ({ value }) => typeof value === 'string' && jslRegExp.test(value);

// Values available as `$variable` in JSL
// They are uppercase to avoid name conflict with attributes
const getContext = function ({ ip, params }) {
  // Context-related variables in JSL
  const NOW = (new Date()).toISOString();

  // Request-related variables in JSL
  const IP = ip;
  const PARAMS = params;

  return { NOW, IP, PARAMS };
};

// Execute JSL statements
const evalJsl = function ({ value, context }) {
  /* eslint-disable no-unused-vars */
  const $ = context;
  /* eslint-enable no-unused-vars */

  // Replace $var by $.var
  value = value.replace(jslRegExp, '$1.$2');

  // Beware local (and global) variables are available inside eval(), i.e. must keep it to a minimal
  // TODO: this is highly insecure. E.g. value 'while (true) {}' would freeze the whole server. Also it has access to
  // global variables, including global.process. Problem is that alternatives are much slower, so we need to find a solution.
  const newValue = eval(value);
  return newValue;
};


module.exports = {
  handleJsl,
};
