'use strict';


const pathToRegExp = require('path-to-regexp');


class RoutesManager {

  constructor(routes = []) {
    this._routes = [];
    this.add(routes);
  }

  add(routes = []) {
    routes = routes instanceof Array ? routes : [routes];
    routes.forEach(route => this._add(route));
  }

  _add({ path, route, goal }) {
    const regexp = pathToRegExp(path);
    const variables = regexp.keys.map(key => key.name);

    // Normalize goals
    let goals = goal;
    if (goals) {
      goals = goals instanceof Array ? goals : [goals];
    }

    this._routes.push({ path, route, regexp, variables, goals });
  }

  find({ path, goal }) {
    // Retrieves correct route, according to path
    const route = this._routes.find(({ regexp, goals }) => {
      // Check path
      return regexp.test(path)
        // Check goals
        && (!goals || goals.includes(goal));
    });
    if (!route) { return; }

    // Retrieves path variables, e.g. /path/:id
    const pathVars = route.regexp
      .exec(path)
      // Removes first value, which is the full path
      .slice(1)
      // Adds the name of the variable to the value
      // Will be an incrementing index e.g. for /path/* or /path/(maybe)?/
      .reduce((allVars, value, index) => {
        const key = route.variables[index];
        allVars[key] = value;
        return allVars;
      }, {});
    return Object.assign({ pathVars }, route);
  }

}


module.exports = {
  RoutesManager,
};
