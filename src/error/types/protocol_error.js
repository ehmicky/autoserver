'use strict';


const { ExtendableError } = require('../../utilities');


class ProtocolError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'ProtocolError';
  }

}

class HttpProtocolError extends ProtocolError {

  constructor(...args) {
    super(...args);
    this.type = 'HttpProtocolError';
  }

}


module.exports = {
  ProtocolError,
  HttpProtocolError,
};