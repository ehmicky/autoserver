'use strict';


const { EngineError } = require('../error');
const { map } = require('../utilities');
const { compileJsl } = require('./compile');


class Jsl {

  // TODO: variable name check
  constructor({ idl }) {
    this.input = {};
    this.compileHelpers({ idl });
    this.compileVariables({ idl });
  }

  // TODO: variable name check
  add(input = {}) {
    Object.assign(this.input, input);
  }

  // Take JSL, inline or not, and turns into `function (...args)`
  // firing the first one,
  // with $1, $2, etc. provided as extra arguments
  compileHelpers({ idl: { helpers = {} } }) {
    const compiledHelpers = map(helpers, helper => {
      return (...args) => {
        // Non-inline helpers only get positional arguments, no variables
        if (typeof helper === 'function') {
          return helper(...args);
        }

        // Provide $1, $2, etc. to inline JSL
        const [$1, $2, $3, $4, $5, $6, $7, $8, $9] = args;
        const input = { $1, $2, $3, $4, $5, $6, $7, $8, $9 };

        return this.run({ value: helper, input });
      };
    });
    this.add(compiledHelpers);
  }

  compileVariables({ idl: { variables = {} } }) {
    const compiledVariables = map(variables, variable => {
      return () => {
        return this.run({ value: variable });
      };
    });
    this.add(compiledVariables);
  }

  // Process (already compiled) JSL function,
  // i.e. fires it and returns its value
  // If this is not JSL, returns as is
  run({
    value,
    input = {},
    errorType: ErrorType = EngineError,
    errorReason = 'UTILITY_ERROR',
  }) {
    try {
      const params = Object.assign({}, this.input, input);
      const jslFunc = compileJsl({ jsl: value, params });

      if (typeof jslFunc !== 'function') { return jslFunc; }
      return jslFunc(params);
    } catch (innererror) {
      const message = `JSL expression failed: '${value}'`;
      throw new ErrorType(message, { reason: errorReason, innererror });
    }
  }
}


module.exports = {
  Jsl,
};
