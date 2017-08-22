'use strict';

const { addIfv } = require('../../idl_func');
const { addReqInfo } = require('../../events');

const getTimestamp = function (input) {
  const { now } = input;

  const timestamp = (new Date(now)).toISOString();
  const inputA = addIfv(input, { $NOW: timestamp });
  const inputB = addReqInfo(inputA, { timestamp });
  const inputC = { ...inputB, timestamp };

  return inputC;
};

module.exports = {
  getTimestamp,
};
