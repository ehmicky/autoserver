'use strict';


// Decide which middleware to pick according to request protocol
// Only protocol supported so far is HTTP
const router = function (req, res) {
  const route = Object.keys(routes).find(route => routes[route](req, res)) || 'unknown';
  return route;
};

const routes = {

  http: req => [1, 2].includes(req.httpVersionMajor),

};


module.exports = {
  router,
};