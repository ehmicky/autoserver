'use strict';

const { checkNames } = require('./validation');
const { getHelpers } = require('./helpers');

const createJsl = function ({ idl }) {
  const helpers = getHelpers({ idl });
  const params = checkNames({ params: helpers, type: 'USER' });
  return { params };
};

const addJsl = function (input, params, { type = 'SYSTEM' } = {}) {
  const paramsA = checkNames({ params, type });
  const paramsB = Object.assign({}, input.jsl.params, paramsA);
  return Object.assign({}, input, { jsl: { params: paramsB } });
};

module.exports = {
  createJsl,
  addJsl,
};
