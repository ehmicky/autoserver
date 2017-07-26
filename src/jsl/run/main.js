'use strict';

const { mapValues } = require('../../utilities');
const { isJsl } = require('../test');

const { checkNames } = require('./validation');
const { JslHelper } = require('./helpers');
const { getParams } = require('./params');
const { runJSL } = require('./run');

const addJslToInput = function (input, jsl, params, { type = 'SYSTEM' } = {}) {
  checkNames(params, type);
  const newParams = Object.assign({}, jsl.params, params);
  const newInput = Object.assign({}, input, { jsl: { params: newParams } });
  return newInput;
};

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
  addJslToInput,
  getHelpers,
  runJsl,
};
