'use strict';

const pathToRegExp = require('path-to-regexp');

const { transtype, assignObject } = require('../../../utilities');
const { throwError } = require('../../../error');

const allRoutes = require('./routes');

const getRoutes = function ({ rawRoutes }) {
  return rawRoutes.map(rawRoute => getRoute(rawRoute));
};

const getRoute = function ({ path, name, goal }) {
  const regexp = pathToRegExp(path);
  const variables = regexp.keys.map(key => key.name);
  const goals = goal && !Array.isArray(goal) ? [goal] : goal;

  return { path, name, regexp, variables, goals };
};

const exportedRoutes = getRoutes({ rawRoutes: allRoutes });

// Retrieves correct route, according to path
const findRoute = function ({ routes, path, goal }) {
  // Check path and goals
  const route = routes.find(({ regexp, goals }) =>
    regexp.test(path) && (!goals || goals.includes(goal))
  );

  if (!route) {
    const message = 'The requested URL was not found';
    throwError(message, { reason: 'NOT_FOUND' });
  }

  return route;
};

// Retrieves path variables, e.g. /path/:id
const getPathVars = function ({ path, route: { regexp, variables } }) {
  return regexp
    .exec(path)
    // Removes first value, which is the full path
    .slice(1)
    // Adds the name of the variable to the value
    // Will be an incrementing index e.g. for /path/* or /path/(maybe)?/
    .map((value, index) => {
      const key = variables[index];
      const transtypedValue = transtype(value);
      return { [key]: transtypedValue };
    })
    .reduce(assignObject, {});
};

module.exports = {
  routes: exportedRoutes,
  findRoute,
  getPathVars,
};
