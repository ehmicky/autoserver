'use strict';


const { ExtendableError } = require('../../utilities');


class ProtocolError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'ProtocolError';
  }

}

// See error_handler for explanation on each error type
ProtocolError.reasons = [
  'NOT_FOUND',
  'UNKNOWN',
];

module.exports = {
  ProtocolError,
};