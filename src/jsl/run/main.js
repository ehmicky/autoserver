'use strict';


const { map } = require('../../utilities');
const { isJsl } = require('../test');
const { checkNames } = require('./validation');
const { runJsl } = require('./run');
const { JslHelper } = require('./helpers');
const { getParams } = require('./params');


// Instance containing JSL parameters and helpers, re-created for each request
class Jsl {

  constructor({ params = {}, exposeMap = {} } = {}) {
    Object.assign(this, { params, exposeMap });
  }

  // Return a shallow copy.
  // Reason: requests can trigger several sub-requests, which should be
  // independant from each other, i.e. all get their own JSL instance.
  add(params = {}, { type = 'SYSTEM' } = {}) {
    checkNames(params, type);
    const newParams = Object.assign({}, this.params, params);
    return new Jsl({ params: newParams, exposeMap: this.exposeMap });
  }

  // Take JSL, inline or not, and turns into `function (...args)`
  // firing the first one, with $1, $2, etc. provided as extra arguments
  addHelpers({ helpers = {} }) {
    const compiledHelpers = map(helpers, ({ value: helper, useParams }) => {
      // Constants are left as is
      const isConstant = typeof helper !== 'function' &&
        !isJsl({ jsl: helper });
      if (isConstant) { return helper; }

      return new JslHelper({ helper, useParams });
    });

    return this.add(compiledHelpers, { type: 'USER' });
  }

  run({ value, params, type }) {
    // Merge JSL parameters with JSL call parameters
    const allParams = Object.assign({}, this.params, params);

    const jslParams = getParams({
      params: allParams,
      type,
      exposeMap: this.exposeMap,
    });
    return runJsl({ value, params: jslParams, type });
  }
}


module.exports = {
  Jsl,
};
