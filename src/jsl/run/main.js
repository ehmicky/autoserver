'use strict';


const { map } = require('../../utilities');
const { isJsl } = require('../test');
const { throwJslError } = require('../error');
const { getRawJsl } = require('../tokenize');
const { compileJsl } = require('./compile');
const { checkNames } = require('./validation');
const { JslHelper } = require('./helper');


// Instance containing JSL parameters and helpers, re-created for each request
class Jsl {

  constructor({ params = {} } = {}) {
    this.params = params;
    this.cloneHelpers();
  }

  // Return a shallow copy.
  // Reason: requests can trigger several sub-requests, which should be
  // independant from each other, i.e. all get their own JSL instance.
  add(params = {}, { type = 'SYSTEM' } = {}) {
    checkNames(params, type);
    const newParams = Object.assign({}, this.params, params);
    return new Jsl({ params: newParams });
  }

  // Take JSL, inline or not, and turns into `function (...args)`
  // firing the first one, with $1, $2, etc. provided as extra arguments
  addHelpers({ helpers = {} }) {
    const compiledHelpers = map(helpers, ({ value: helper, useParams }) => {
      // Constants are left as is
      const isConstant = typeof helper !== 'function' &&
        !isJsl({ jsl: helper });
      if (isConstant) { return helper; }

      return new JslHelper({ helper, jsl: this, useParams });
    });

    return this.add(compiledHelpers, { type: 'USER' });
  }

  // Each new JSL instance rebind helpers context, by using JslHelper.clone()
  cloneHelpers() {
    const { params } = this;
    for (const [name, param] of Object.entries(params)) {
      if (param instanceof JslHelper) {
        params[name] = param.clone({ jsl: this });
      }
    }
  }

  // Process (already compiled) JSL function,
  // i.e. fires it and returns its value
  // If this is not JSL, returns as is
  run({ value, params = {}, type = 'system' }) {
    try {
      const allParams = Object.assign({}, this.params, params);
      const paramsKeys = Object.keys(allParams);
      const jslFunc = compileJsl({ jsl: value, paramsKeys, type });

      if (typeof jslFunc !== 'function') { return jslFunc; }
      return jslFunc(allParams);
    } catch (innererror) {
      // JSL without parenthesis
      const rawJsl = getRawJsl({ jsl: value });
      // If non-inline function, function name
      const funcName = typeof value === 'function' &&
        value.name &&
        `${value.name}()`;
      const expression = rawJsl || funcName || value;
      const message = `JSL expression failed: '${expression}'`;
      throwJslError({ message, type, innererror });
    }
  }
}


module.exports = {
  Jsl,
};
