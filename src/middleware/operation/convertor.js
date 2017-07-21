'use strict';

const { pick } = require('../../utilities');

// Converts from Protocol format to Operation format
const operationConvertor = async function (input) {
  const nextInput = pick(input, operationAttributes);
  const response = await this.next(nextInput);
  return response;
};

// Not kept: protocol, protocolFullName, timestamp, requestId, ip, url,
// path, method, headers
const operationAttributes = [
  'goal',
  'queryVars',
  'pathVars',
  'params',
  'settings',
  'payload',
  'route',
  'origin',
  'jsl',
  'log',
  'perf',
  'idl',
  'serverOpts',
  'apiServer',
];

module.exports = {
  operationConvertor,
};
