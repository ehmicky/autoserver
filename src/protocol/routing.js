'use strict';


const handler = async function routingHandler(req, res) {
  // Remove search string and hash
  const url = req.url.replace(/\?.*/, '');

  if (url === '/graphiql') {
    req.route = 'graphiql';
  } else if (url === '/graphql') {
    req.route = 'graphql';
  }

  const response = await this.next(req, res);
  return response;
};


module.exports = handler;