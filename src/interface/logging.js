'use strict';


const layers = require('../layers');


const handler = async function (request) {
  logRequest(request);

  const response = await layers.next(request);
  return response;
};

const logRequest = function (request) {
  const { protocol, [Symbol.for('method')]: method, url, headers, params } = request;
  console.log(`${protocol} ${method} ${url} ${JSON.stringify(headers)} ${JSON.stringify(params)}`);

  // Those attributes were just needed for logging. The lower layers should be protocol-agnostic
  for (const attrName of ['protocol', 'url', 'headers']) {
    delete request[attrName];
  }
};


module.exports = handler;