'use strict';

const { transtype } = require('../../utilities');

// Retrieves path variables, e.g. /path/:id
const getPathvars = function ({ path, route: { regexp, variables } }) {
  const pathvars = regexp
    .exec(path)
    // Removes first value, which is the full path
    .slice(1)
    .map((value, index) => getPathvar({ value, index, variables }));
  const pathvarsA = Object.assign({}, ...pathvars);
  return pathvarsA;
};

// Adds the name of the variable to the value
// Will be an incrementing index e.g. for /path/* or /path/(maybe)?/
const getPathvar = function ({ value, index, variables }) {
  const key = variables[index];
  const valueA = transtype(value);
  return { [key]: valueA };
};

module.exports = {
  getPathvars,
};
