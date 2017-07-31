'use strict';

const { pick } = require('../../utilities');
const { commonAttributes } = require('../common_attributes');

// Converts from Protocol format to Operation format
const operationConvertor = async function (nextFunc, input) {
  const inputA = pick(input, operationAttributes);
  const response = await nextFunc(inputA);
  return response;
};

// Not kept: protocol, protocolFullName, timestamp, requestId, ip, url,
// path, method, headers
const operationAttributes = [
  ...commonAttributes,
  'goal',
  'queryVars',
  'pathVars',
  'params',
  'settings',
  'payload',
  'route',
  'origin',
];

module.exports = {
  operationConvertor,
};
