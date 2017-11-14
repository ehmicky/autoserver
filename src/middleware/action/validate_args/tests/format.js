'use strict';

const { pickBy } = require('../../../../utilities');
const { formatHandlers } = require('../../../../formats');
const { stringTest, enumTest } = require('../../../../fast_validation');

const getPayloadFormats = function () {
  const formats = pickBy(formatHandlers, isPayloadType);
  const formatsA = Object.keys(formats);
  return formatsA;
};

const isPayloadType = function ({ types = [] }) {
  return types.includes('payload');
};

// Validates args.format
const formatTests = [
  stringTest('format'),

  enumTest('format', getPayloadFormats()),
];

module.exports = {
  format: formatTests,
};
