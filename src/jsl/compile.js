'use strict';


const { recurse } = require('../utilities');
const { isJsl, isEscapedJsl } = require('./test');
const { getRawJsl } = require('./tokenize');
const { jslArguments } = require('./variables');


// Transform JSL into a function with the JSL as body
// Returns as it is not JSL
// This can throw if JSL's JavaScript is wrong
const compileJsl = ({ jsl, model }) => recurse({ value: jsl, cb: singleCompileJsl.bind(null, model) });
const singleCompileJsl = function (model, jsl) {
  // If this is not JSL, abort
  if (!isJsl({ jsl })) {
    // Can escape (...) from being interpreted as JSL by escaping first parenthesis
    if (isEscapedJsl({ jsl })) {
      jsl = jsl.replace('\\', '');
    }
    return jsl;
  }

  // Removes outer parenthesis
  let rawJsl = getRawJsl({ jsl });

  // JSL values being a top-level ternary test can use shortcut notation 'TEST ? VAL' instead of 'TEST ? VAL : undefined'
  // This is particularly handy since YAML does not allow : in unquoted strings
  if (ternaryTest.test(rawJsl)) {
    rawJsl += ' : undefined';
  }

  // Create a function with the JSL as body
  const func = new Function(jslArguments, `return ${rawJsl};`);
  // Keep the JSL when we need clean error messages
  func.jsl = rawJsl;

  return func;
};

// TODO: use JavaScript parser instead of RegExp matching
const ternaryTest = /\?[^:]+$/;


module.exports = {
  compileJsl,
};
