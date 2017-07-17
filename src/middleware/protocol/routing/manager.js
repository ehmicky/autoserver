'use strict';

const pathToRegExp = require('path-to-regexp');

const { transtype, assignObject } = require('../../../utilities');
const { routes } = require('./routes');

class RoutesManager {
  constructor ({ routes = [] }) {
    this._routes = [];

    for (const route of routes) {
      this.add(route);
    }
  }

  add ({ path, name, goal }) {
    const regexp = pathToRegExp(path);
    const variables = regexp.keys.map(({ name }) => name);
    const goals = goal && !Array.isArray(goal) ? [goal] : goal;

    this._routes.push({ path, name, regexp, variables, goals });
  }

  // Retrieves correct route, according to path
  find ({ path, goal }) {
    // Check path and goals
    return this._routes.find(({ regexp, goals }) => {
      return regexp.test(path) && (!goals || goals.includes(goal));
    });
  }

  // Retrieves path variables, e.g. /path/:id
  getPathVars ({ path, route: { regexp, variables } }) {
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
  }
}

const routesManager = new RoutesManager({ routes });

module.exports = {
  routesManager,
};
