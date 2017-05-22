'use strict';


const { isJsl, isEscapedJsl } = require('./test');
const { getRawJsl } = require('./tokenize');
const { getJslParameters } = require('./parameters');
const { EngineError } = require('../error');


// Transform JSL into a function with the JSL as body
// Returns as it is not JSL
// This can throw if JSL's JavaScript is wrong
const compileJsl = function ({
  jsl,
  idl,
  target,
  error: {
    type: ErrorType = EngineError,
    reason = 'IDL_VALIDATION',
  } = {},
}) {
  const parameters = getJslParameters({ idl, target });

  // If this is not JSL, abort
  if (!isJsl({ jsl })) {
    // Can escape (...) from being interpreted as JSL by escaping
    // first parenthesis
    if (isEscapedJsl({ jsl })) {
      jsl = jsl.replace('\\', '');
    }
    return jsl;
  }

  // Removes outer parenthesis
  const rawJsl = getRawJsl({ jsl });

  // Create a function with the JSL as body
  let func;
  try {
    func = new Function(parameters, `return ${rawJsl};`);
  } catch (innererror) {
    const message = `JSL syntax error: '${jsl}'`;
    throw new ErrorType(message, { reason, innererror });
  }
  // Keep the JSL when we need clean error messages
  func.jsl = rawJsl;

  func.isInlineJsl = true;

  return func;
};


module.exports = {
  compileJsl,
};
