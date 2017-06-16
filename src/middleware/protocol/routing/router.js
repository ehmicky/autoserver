'use strict';


const { EngineError } = require('../../../error');
const { makeImmutable } = require('../../../utilities');
const { getRoutes } = require('./routes');


// Add route and URL parameters to input
const router = function () {
  const routes = getRoutes();

  return async function router(input) {
    const { path, goal, log } = input;
    const perf = log.perf.start('protocol.router', 'middleware');

    const route = routes.find({ path, goal });
    if (!route) {
      const message = 'The requested URL was not found';
      throw new EngineError(message, { reason: 'NOT_FOUND' });
    }

    const pathVars = routes.getPathVars({ path, route });
    makeImmutable(pathVars);

    log.add({ route: route.name, pathVars });
    Object.assign(input, { route: route.name, pathVars });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  router,
};
