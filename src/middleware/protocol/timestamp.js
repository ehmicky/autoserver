'use strict';

const getTimestamp = async function (input) {
  const { jsl, log, now } = input;

  const timestamp = (new Date(now)).toISOString();
  const nextInput = jsl.addToInput(input, { $NOW: timestamp });
  log.add({ timestamp });
  Object.assign(nextInput, { timestamp });

  const response = await this.next(nextInput);
  return response;
};

module.exports = {
  getTimestamp,
};
