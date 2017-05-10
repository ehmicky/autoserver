'use strict';


const { getRoutes } = require('./routes');
const { EngineError } = require('../../error');


const router = async function () {
  const routes = getRoutes();
  return async function router(input) {
    const { path, params, method } = input;
    const matchedRoute = routes.find({ path, method });
    if (!matchedRoute) {
      throw new EngineError('The requested URL was not found', { reason: 'NOT_FOUND' });
    }

    // Add route and path parameters to input
    const { route, pathParams } = matchedRoute;
    const newParams = Object.assign(params, pathParams);
    Object.assign(input, { route, params: newParams });

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  router,
};
