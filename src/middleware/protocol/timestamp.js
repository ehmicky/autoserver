'use strict';

const getTimestamp = async function (input) {
  const { jsl, log, now } = input;

  const timestamp = (new Date(now)).toISOString();
  const newJsl = jsl.add({ $NOW: timestamp });
  log.add({ timestamp });

  Object.assign(input, { timestamp, jsl: newJsl });

  const response = await this.next(input);
  return response;
};

module.exports = {
  getTimestamp,
};
