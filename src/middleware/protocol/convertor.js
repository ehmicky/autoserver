'use strict';

const { pick } = require('../../utilities');

// Converts from no format to Protocol format
const protocolConvertor = async function (nextFunc, input) {
  const inputA = pick(input, protocolAttributes);
  const response = await nextFunc(inputA);
  return response;
};

const protocolAttributes = [
  'currentPerf',
  'specific',
  'idl',
  'jsl',
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
