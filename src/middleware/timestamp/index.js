'use strict';


const getTimestamp = function () {
  return async function getTimestamp(input) {
    const { protocol, jslInput } = input;

    protocol.timestamp = (new Date()).toISOString();
    jslInput.$NOW = protocol.timestamp;

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  getTimestamp,
};
