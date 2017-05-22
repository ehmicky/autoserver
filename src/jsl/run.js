'use strict';


const { EngineError } = require('../error');
const { getJslVariables } = require('./variables');


// Process (already compiled) JSL function, i.e. fires it and returns its value
// If this is not JSL, returns as is
const runJsl = function (
  jslFunc,
  jslInput,
  {
    error: {
      type: ErrorType = EngineError,
      reason = 'UTILITY_ERROR',
    } = {},
  } = {}
) {
  if (typeof jslFunc !== 'function') { return jslFunc; }

  const variables = getJslVariables(jslFunc, jslInput);
  try {
    return jslFunc(variables);
  } catch (innererror) {
    const message = `JSL expression failed: '${jslFunc.jsl}'`;
    throw new ErrorType(message, { reason, innererror });
  }
};


module.exports = {
  runJsl,
};
