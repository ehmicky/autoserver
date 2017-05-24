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

  _add({ path, route, method }) {
    const regexp = pathToRegExp(path);
    const variables = regexp.keys.map(key => key.name);

    // Normalize methods
    let methods = method;
    if (methods) {
      methods = methods instanceof Array ? methods : [methods];
    }

    this._routes.push({ path, route, regexp, variables, methods });
  }

  find({ path, method }) {
    // Retrieves correct route, according to path
    const route = this._routes.find(({ regexp, methods }) => {
      // Check path
      return regexp.test(path)
        // Check methods
        && (!methods || methods.includes(method));
    });
    if (!route) { return; }

    // Retrieves path variables, e.g. /path/:id
    const pathParams = route.regexp
      .exec(path)
      // Removes first value, which is the full path
      .slice(1)
      // Adds the name of the variable to the value
      // Will be an incrementing index e.g. for /path/* or /path/(maybe)?/
      .reduce((allParams, value, index) => {
        const key = route.variables[index];
        allParams[key] = value;
        return allParams;
      }, {});
    return Object.assign({ pathParams }, route);
  }

}


module.exports = {
  RoutesManager,
};
