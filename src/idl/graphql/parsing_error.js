'use strict';


const { ExtendableError } = require('../../utilities');


class GraphqlParsingError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'GraphqlParsingError';
  }

}

module.exports = {
  GraphqlParsingError,
};