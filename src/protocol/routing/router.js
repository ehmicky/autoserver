'use strict';


const { routes } = require('./routes');
const { ProtocolError } = require('../error');


const router = async function (input) {
  const { path } = input;
  const matchedRoute = routes.find(path);
  if (!matchedRoute) {
    throw new ProtocolError('The requested URL was not found', { reason: 'NOT_FOUND' });
  }

  const { route, pathParams } = matchedRoute;
  const output = Object.assign({ route, pathParams }, input);
  const response = await this.next(output);
  return response;
};


module.exports = {
  router,
};