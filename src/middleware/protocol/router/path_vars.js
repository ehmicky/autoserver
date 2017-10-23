'use strict';

const { transtype, assignObject } = require('../../../utilities');

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
      const valueA = transtype(value);
      return { [key]: valueA };
    })
    .reduce(assignObject, {});
};

module.exports = {
  getPathVars,
};
