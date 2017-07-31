'use strict';

const { pick } = require('../../utilities');
const { commonAttributes } = require('../common_attributes');

// Converts from no format to Protocol format
const protocolConvertor = async function (nextFunc, input) {
  const inputA = pick(input, protocolAttributes);
  const response = await nextFunc(inputA);
  return response;
};

const protocolAttributes = [
  ...commonAttributes,
  'specific',
  'protocol',
  'protocolHandler',
  'now',
  'reqPerf',
];

module.exports = {
  protocolConvertor,
};
