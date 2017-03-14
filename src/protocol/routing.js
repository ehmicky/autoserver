'use strict';


const handler = async function (req, res) {
  // Remove search string and hash
  const url = req.url.replace(/\?.*/, '');

  if (url === '/graphiql') {
    req.route = 'GraphiQL';
  } else if (url === '/graphql') {
    req.route = 'GraphQL';
  }

  const response = await this.next(req, res);
  return response;
};


module.exports = handler;