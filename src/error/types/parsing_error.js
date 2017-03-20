'use strict';


const { ExtendableError } = require('../../utilities');


class ParsingError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'ParsingError';
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
  GraphqlParsingError,
};