'use strict';


const { getJslVariables } = require('./variables');


// Process (already compiled) JSL function, i.e. fires it and returns its value
// If this is not JSL, returns as is
const runJsl = function (jslFunc, jslInput) {
  if (typeof jslFunc !== 'function') { return jslFunc; }

  const variables = getJslVariables(jslFunc, jslInput);
  return jslFunc(variables);
};


module.exports = {
  runJsl,
};
