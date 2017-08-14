'use strict';

const { addJsl } = require('../../jsl');
const { addReqInfo } = require('../../events');

const getTimestamp = async function (nextFunc, input) {
  const { now } = input;

  const timestamp = (new Date(now)).toISOString();
  const inputA = addJsl(input, { $NOW: timestamp });
  const inputB = addReqInfo(inputA, { timestamp });
  const inputC = { ...inputB, timestamp };

  const response = await nextFunc(inputC);
  return response;
};

module.exports = {
  getTimestamp,
};
