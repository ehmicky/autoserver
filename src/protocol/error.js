'use strict';


const { ExtendableError } = require('../utilities');


class ProtocolError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'ProtocolError';
  }

}

ProtocolError.reason = {
  NOT_FOUND: 'NotFound',
};

module.exports = {
  ProtocolError,
};