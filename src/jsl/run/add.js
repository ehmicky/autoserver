'use strict';

const { getHelpers } = require('./helpers');

const createJsl = function ({ idl }) {
  const helpers = getHelpers({ idl });
  return { params: helpers };
};

const addJsl = function (input, params) {
  const paramsB = { ...input.jsl.params, ...params };
  return { ...input, jsl: { params: paramsB } };
};

module.exports = {
  createJsl,
  addJsl,
};
