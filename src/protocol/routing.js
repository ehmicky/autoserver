'use strict';


const layers = require('../layers');


const handler = async function (req, res) {
  if (req.url === '/graphiql') {
    req.route = 'GraphiQL';
  }

  const response = await layers.next(req, res);
  return response;
};


module.exports = handler;