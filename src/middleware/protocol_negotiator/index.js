'use strict';


// Decide which middleware to pick according to request protocol
// Only protocol supported so far is HTTP
const protocolNegotiator = function ({ req, res }) {
  const protocol = Object.keys(protocols).find(route => protocols[route]({ req, res })) || 'unknown';
  return protocol;
};

const protocols = {

  http: ({ req }) => [1, 2].includes(req.httpVersionMajor),

};


module.exports = {
  protocolNegotiator,
};