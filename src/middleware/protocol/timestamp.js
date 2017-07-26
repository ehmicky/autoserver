'use strict';

const { addJslToInput } = require('../../jsl');

const getTimestamp = async function (nextFunc, input) {
  const { jsl, log, now } = input;

  const timestamp = (new Date(now)).toISOString();
  const nextInput = addJslToInput(input, jsl, { $NOW: timestamp });
  log.add({ timestamp });
  Object.assign(nextInput, { timestamp });

  const response = await nextFunc(nextInput);
  return response;
};

module.exports = {
  getTimestamp,
};
