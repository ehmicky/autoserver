'use strict';

const { mapValues, makeImmutable } = require('../../utilities');
const { isJsl } = require('../test');

const { checkNames } = require('./validation');
const { JslHelper } = require('./helpers');
const { getParams } = require('./params');
const { runJSL } = require('./run');

// Instance containing JSL parameters and helpers, re-created for each request
class Jsl {
  constructor ({ params = {} } = {}) {
    Object.assign(this, { params });
    makeImmutable(this);
  }

  // Return a shallow copy.
  // Reason: requests can trigger several sub-requests, which should be
  // independant from each other, i.e. all get their own JSL instance.
  add (params = {}, { type = 'SYSTEM' } = {}) {
    checkNames(params, type);
    const newParams = Object.assign({}, this.params, params);
    return new Jsl({ params: newParams });
  }

  addToInput (input, params) {
    const newJsl = this.add(params);
    return Object.assign({}, input, { jsl: newJsl });
  }
}

// Take JSL, inline or not, and turns into `function (...args)`
// firing the first one, with $1, $2, etc. provided as extra arguments
const getHelpers = function ({ idl: { helpers = {} } }) {
  return mapValues(helpers, ({ value: helper, useParams }) => {
    // Constants are left as is
    const isConstant = typeof helper !== 'function' &&
      !isJsl({ jsl: helper });
    if (isConstant) { return helper; }

    return new JslHelper({ helper, useParams });
  });
};

const runJsl = function ({
  jsl,
  value,
  params: oParams,
  type,
  idl: { exposeMap },
}) {
  // Merge JSL parameters with JSL call parameters
  const allParams = Object.assign({}, jsl.params, oParams);

  const params = getParams({ params: allParams, type, exposeMap });
  // TODO: merge with `runJSL`
  return runJSL({ value, params, type });
};

module.exports = {
  Jsl,
  getHelpers,
  runJsl,
};
