'use strict';


const { findKey } = require('lodash');


// Decides which interface to use (e.g. GraphQL) according to route
const interfaceNegotiator = function () {
  return async function interfaceNegotiator(input) {
    const { route, jsl, log } = input;
    const perf = log.perf.start('interface.negotiator', 'middleware');

    const interf = findKey(interfaces, test => test({ route }));

    const newJsl = jsl.add({ $INTERFACE: interf });

    log.add({ interface: interf });
    Object.assign(input, { interface: interf, jsl: newJsl });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

const interfaces = {

  GraphQL: ({ route }) => route === 'GraphQL',

  GraphiQL: ({ route }) => route === 'GraphiQL',

  GraphQLPrint: ({ route }) => route === 'GraphQLPrint',

};


module.exports = {
  interfaceNegotiator,
};
