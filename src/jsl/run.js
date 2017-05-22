'use strict';


const { EngineError } = require('../error');
const { getJslVariables } = require('./variables');


class Jsl {

  constructor() {
    this.input = {};
  }

  // TODO: variable name check
  add(input = {}) {
    Object.assign(this.input, input);
  }

  // Process (already compiled) JSL function,
  // i.e. fires it and returns its value
  // If this is not JSL, returns as is
  run(
    jslFunc,
    jslInput = {},
    {
      error: {
        type: ErrorType = EngineError,
        reason = 'UTILITY_ERROR',
      } = {},
    } = {}
  ) {
    if (typeof jslFunc !== 'function') { return jslFunc; }

    const input = Object.assign({}, this.input, jslInput);
    const variables = getJslVariables(jslFunc, input);
    try {
      return jslFunc(variables);
    } catch (innererror) {
      const message = `JSL expression failed: '${jslFunc.jsl}'`;
      throw new ErrorType(message, { reason, innererror });
    }
  }

}


module.exports = {
  Jsl,
};
