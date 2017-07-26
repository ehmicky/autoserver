'use strict';

const { pick } = require('../../utilities');

// Converts from no format to Protocol format
const protocolConvertor = async function (nextFunc, input) {
  const nextInput = pick(input, protocolAttributes);
  const response = await nextFunc(nextInput);
  return response;
};

const protocolAttributes = [
  'currentPerf',
  'specific',
  'idl',
  'serverOpts',
  'apiServer',
  'log',
  'perf',
  'protocol',
  'protocolHandler',
  'now',
  'reqPerf',
];

module.exports = {
  protocolConvertor,
};
