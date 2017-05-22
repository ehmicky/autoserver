'use strict';


const { isJsl, isEscapedJsl } = require('./test');
const { getRawJsl } = require('./tokenize');


// Transform JSL into a function with the JSL as body
// Returns as it is not JSL
// This can throw if JSL's JavaScript is wrong
const compileJsl = function ({ jsl, params }) {
  // If this is not JSL, abort
  if (!isJsl({ jsl })) {
    // Can escape (...) from being interpreted as JSL by escaping
    // first parenthesis
    if (isEscapedJsl({ jsl })) {
      jsl = jsl.replace('\\', '');
    }
    return jsl;
  }

  const parameters = `{ ${Object.keys(params)} }`;

  // Removes outer parenthesis
  const rawJsl = getRawJsl({ jsl });

  // Create a function with the JSL as body
  const func = new Function(parameters, `return ${rawJsl};`);
  // Keep the JSL when we need clean error messages
  func.jsl = rawJsl;

  return func;
};


module.exports = {
  compileJsl,
};
