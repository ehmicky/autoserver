'use strict';


const { processError } = require('../../error');


// Error handler adding CRUD-related information to exceptions
const crudErrorHandler = function () {
  return async function crudErrorHandler(input) {
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
  crudErrorHandler,
};
