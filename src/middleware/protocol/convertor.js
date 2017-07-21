'use strict';

const { pick } = require('../../utilities');

// Converts from no format to Protocol format
const protocolConvertor = async function (input) {
  const newInput = pick(input, protocolAttributes);
  const response = await this.next(newInput);
  return response;
};

const protocolAttributes = [
  'specific',
  'idl',
  'serverOpts',
  'apiServer',
  'log',
  'perf',
  'protocol',
  'protocolHandler',
  'now',
];

module.exports = {
  protocolConvertor,
};
