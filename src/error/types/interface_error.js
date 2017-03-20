'use strict';


const { ExtendableError } = require('../../utilities');


class InterfaceError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'InterfaceError';
  }

}

class GraphqlInterfaceError extends InterfaceError {

  constructor(...args) {
    super(...args);
    this.type = 'GraphqlInterfaceError';
  }

}


module.exports = {
  InterfaceError,
  GraphqlInterfaceError,
};