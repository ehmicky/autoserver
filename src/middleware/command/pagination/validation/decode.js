'use strict';

const { assignObject } = require('../../../../utilities');
const { addErrorHandler } = require('../../../../error');
const { decode } = require('../encoding');

const getDecodedTokens = function ({ args }) {
  const decodedTokens = ['before', 'after']
    .filter(isNotEmptyToken.bind(null, { args }))
    .map(getDecodedToken.bind(null, { args }))
    .reduce(assignObject, {});
  return decodedTokens;
};

const isNotEmptyToken = function ({ args }, name) {
  const token = args[name];
  return token !== undefined && token !== '';
};

const getDecodedToken = function ({ args }, name) {
  const token = args[name];
  const decodedToken = eDecode({ token, name });
  return { [name]: decodedToken };
};

const eDecode = addErrorHandler(decode, {
  message: ({ name }) => `Wrong parameters: '${name}' is invalid`,
  reason: 'INPUT_VALIDATION',
});

module.exports = {
  getDecodedTokens,
};
