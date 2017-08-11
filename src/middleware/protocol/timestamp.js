'use strict';

const { addJsl } = require('../../jsl');
const { addLogInfo } = require('../../events');

const getTimestamp = async function (nextFunc, input) {
  const { now } = input;

  const timestamp = (new Date(now)).toISOString();
  const inputA = addJsl(input, { $NOW: timestamp });
  const inputB = addLogInfo(inputA, { timestamp });
  const inputC = { ...inputB, timestamp };

  const response = await nextFunc(inputC);
  return response;
};

module.exports = {
  getTimestamp,
};
