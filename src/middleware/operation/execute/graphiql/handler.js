'use strict';


const { renderGraphiQL } = require('./render');


const executeGraphiql = function ({ serverState }) {
  return async function executeGraphiql(input) {
    const { queryVars, payload = {}, log } = input;
    const perf = log.perf.start('operation.executeGraphiql', 'middleware');

    const endpointURL = getEndpointURL({ serverState });
    const {
      query,
      variables,
      operationName,
    } = Object.assign({}, queryVars, payload);

    const content = await renderGraphiQL({
      endpointURL,
      query,
      variables,
      operationName,
    });

    perf.stop();
    return {
      type: 'html',
      content,
    };
  };
};

const getEndpointURL = function ({
  serverState: {
    apiServer: {
      servers: { HTTP },
    },
  },
}) {
  let { address, port } = HTTP.address();

  // TODO: remove once we support CORS
  address = 'localhost';

  return `http://${address}:${port}/graphql`;
};


module.exports = {
  executeGraphiql,
};
