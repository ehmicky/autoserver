'use strict';


const { ExtendableError } = require('../../utilities');


class ParsingError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'ParsingError';
  }

}

class HttpParsingError extends ParsingError {

  constructor(...args) {
    super(...args);
    this.type = 'HttpParsingError';
  }

}

class GraphqlParsingError extends ParsingError {

  constructor(...args) {
    super(...args);
    this.type = 'GraphqlParsingError';
  }

}


module.exports = {
  ParsingError,
  HttpParsingError,
  GraphqlParsingError,
};