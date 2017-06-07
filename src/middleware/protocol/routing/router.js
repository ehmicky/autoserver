'use strict';


const { EngineError } = require('../../../error');
const { getRoutes } = require('./routes');


const router = function ({ startupLog }) {
  const perf = startupLog.perf.start('router', 'middleware');
  const routes = getRoutes();
  perf.stop();

  return async function router(input) {
    const { path, method, log } = input;

    const matchedRoute = routes.find({ path, method });
    if (!matchedRoute) {
      const message = 'The requested URL was not found';
      throw new EngineError(message, { reason: 'NOT_FOUND' });
    }

    // Add route and path parameters to input
    const { route, pathVars } = matchedRoute;

    log.add({ route, pathVars });
    Object.assign(input, { route, pathVars });

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  router,
};
