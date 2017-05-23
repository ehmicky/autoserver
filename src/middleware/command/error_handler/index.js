'use strict';


const { processError } = require('../../../error');


// Error handler adding Command-related information to exceptions
const commandErrorHandler = function () {
  return async function commandErrorHandler(input) {
    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      const keyName = 'command';
      const { command: { name: key } } = input;

      error = processError({ error, input, keyName, key });
      throw error;
    }
  };
};


module.exports = {
  commandErrorHandler,
};
