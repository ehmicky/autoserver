'use strict';

const { addJsl } = require('../../jsl');
const { addLogInfo } = require('../../logging');

const getTimestamp = async function (nextFunc, input) {
  const { now } = input;

  const timestamp = (new Date(now)).toISOString();
  const newInput = addJsl({ input, params: { $NOW: timestamp } });
  const loggedInput = addLogInfo(newInput, { timestamp });
  const nextInput = Object.assign({}, loggedInput, { timestamp });

  const response = await nextFunc(nextInput);
  return response;
};

module.exports = {
  getTimestamp,
};
