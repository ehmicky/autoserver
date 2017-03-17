'use strict';


const { console } = require('../utilities');


const logger = async function (request) {
  logRequest(request);

  const response = await this.next(request);
  return response;
};

const logRequest = function (request) {
  const { protocol, method, url, route, headers, params } = request;
  console.log(`${protocol} ${method} ${url} ${route} ${JSON.stringify(headers)} ${JSON.stringify(params)}`);

  // Those attributes were just needed for logging. The lower layers should be protocol-agnostic
  for (const attrName of ['protocol', 'url', 'headers']) {
    delete request[attrName];
  }
};


module.exports = {
  logger,
};