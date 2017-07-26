'use strict';

const { pick } = require('../../utilities');

// Converts from Protocol format to Operation format
const operationConvertor = async function (nextFunc, input) {
  const nextInput = pick(input, operationAttributes);
  const response = await nextFunc(nextInput);
  return response;
};

// Not kept: protocol, protocolFullName, timestamp, requestId, ip, url,
// path, method, headers
const operationAttributes = [
  'currentPerf',
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
