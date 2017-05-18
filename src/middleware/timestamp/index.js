'use strict';


const getTimestamp = function () {
  return async function getTimestamp(input) {
    const { protocol } = input;
    protocol.timestamp = (new Date()).toISOString();

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  getTimestamp,
};
