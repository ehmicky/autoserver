'use strict';


const handler = async function (req, res) {
  if (req.url === '/graphiql') {
    req.route = 'GraphiQL';
  }

  const response = await this.next(req, res);
  return response;
};


module.exports = handler;