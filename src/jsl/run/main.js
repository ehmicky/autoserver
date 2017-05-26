'use strict';


const { EngineError } = require('../../error');
const { map } = require('../../utilities');
const { isJsl } = require('../test');
const { getRawJsl } = require('../tokenize');
const { compileJsl } = require('./compile');
const { checkNames } = require('./validation');


// Instance containing JSL parameters and helpers, re-created for each request
class Jsl {

  constructor({ input = {} } = {}) {
    this.input = input;
  }

  // Return a shallow copy.
  // Reason: requests can trigger several sub-requests, which should be
  // independant from each other, i.e. all get their own JSL instance.
  add(input = {}, { type = 'SYSTEM' } = {}) {
    checkNames(input, type);
    const newInput = Object.assign({}, this.input, input);
    return new Jsl({ input: newInput });
  }

  // Take JSL, inline or not, and turns into `function (...args)`
  // firing the first one, with ARG_1, ARG_2, etc. provided as extra arguments
  addHelpers({ helpers = {} }) {
    const compiledHelpers = map(helpers, helper => {
      // Non-inline helpers only get positional arguments, no parameters
      if (typeof helper === 'function') { return helper; }

      // Constants are left as is
      if (!isJsl({ jsl: helper })) { return helper; }

      // JSL is run with current instance
      return (...args) => {
        // Provide ARG_1, ARG_2, etc. to inline JSL
        const [ARG_1, ARG_2, ARG_3, ARG_4, ARG_5, ARG_6, ARG_7] = args;
        const input = { ARG_1, ARG_2, ARG_3, ARG_4, ARG_5, ARG_6, ARG_7 };

        return this.run({ value: helper, input });
      };
    });

    // Allow helpers to reference each other
    Object.assign(this.input, compiledHelpers);

    return this.add(compiledHelpers, { type: 'USER' });
  }

  // Process (already compiled) JSL function,
  // i.e. fires it and returns its value
  // If this is not JSL, returns as is
  run({ value, input = {}, type = 'server' }) {
    try {
      const params = Object.assign({}, this.input, input);
      const paramsKeys = Object.keys(params);
      const jslFunc = compileJsl({ jsl: value, paramsKeys });

      if (typeof jslFunc !== 'function') { return jslFunc; }
      return jslFunc(params);
    } catch (innererror) {
      // JSL without parenthesis
      const rawJsl = getRawJsl({ jsl: value });
      // If non-inline function, function name
      const funcName = typeof value === 'function' &&
        value.name &&
        `${value.name}()`;
      const expression = rawJsl || funcName || value;
      const message = `JSL expression failed: '${expression}'`;

      const reason = type === 'server' ? 'UTILITY_ERROR' : 'INPUT_VALIDATION';
      throw new EngineError(message, { reason, innererror });
    }
  }
}


module.exports = {
  Jsl,
};
