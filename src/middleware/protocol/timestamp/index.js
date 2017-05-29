'use strict';


const getTimestamp = function () {
  return async function getTimestamp(input) {
    const { jsl } = input;

    const timestamp = (new Date()).toISOString();
    const newJsl = jsl.add({ $NOW: timestamp });
    Object.assign(input, { timestamp, jsl: newJsl });

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  getTimestamp,
};
