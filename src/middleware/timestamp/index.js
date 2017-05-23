'use strict';


const getTimestamp = function () {
  return async function getTimestamp(input) {
    const { protocol, jsl } = input;

    protocol.timestamp = (new Date()).toISOString();
    jsl.add({ NOW: protocol.timestamp });

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  getTimestamp,
};
