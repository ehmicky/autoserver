'use strict';

const { checkNames } = require('./validation');
const { getHelpers } = require('./helpers');

const createJsl = function ({ idl }) {
  const helpers = getHelpers({ idl });
  const params = checkNames({ params: helpers, type: 'USER' });
  return { params };
};

const addJsl = function ({ input, jsl = {}, params, type = 'SYSTEM' }) {
  const validParams = checkNames({ params, type });
  const newParams = Object.assign({}, jsl.params, validParams);
  const newInput = Object.assign({}, input, { jsl: { params: newParams } });
  return newInput;
};

module.exports = {
  createJsl,
  addJsl,
};
