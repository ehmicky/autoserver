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

  _add({ path, route }) {
    const regexp = pathToRegExp(path);
    this._routes.push({ path, route, regexp });
  }

  find(url) {
    return this._routes.find(route => {
      return route.regexp.test(url);
    });
  }

}


module.exports = {
  RoutesManager,
};