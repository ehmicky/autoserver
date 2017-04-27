'use strict';


const { getJslVariables } = require('./variables');


// Process (already compiled) JSL function, i.e. fires it and returns its value
// If this is not JSL, returns as is
const processJsl = function (input) {
  const { jsl } = input;
  if (typeof jsl !== 'function') { return jsl; }

  const variables = getJslVariables(input);
  return jsl(variables);
};


module.exports = {
  processJsl,
};
