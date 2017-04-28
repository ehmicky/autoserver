'use strict';


const { mapValues } = require('lodash');

const { getJslVariables } = require('./variables');


// Process (already compiled) JSL function, i.e. fires it and returns its value
// If this is not JSL, returns as is
const processJsl = function (input) {
  const { jsl: jslFunc } = input;
  if (typeof jslFunc !== 'function') { return jslFunc; }

  const variables = getJslVariables(input);
  const evaluatedVars = evaluateRecursiveVars({ variables });
  return jslFunc(evaluatedVars);
};

// When variables use other variables, without the following function, they would not get lazily evaluated
const evaluateRecursiveVars = function ({ variables }) {
  return mapValues(variables, variable => {
    return typeof variable === 'function' && variable.isVariable ? variable() : variable;
  });
};


module.exports = {
  processJsl,
  evaluateRecursiveVars,
};
