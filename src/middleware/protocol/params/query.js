'use strict';


const { mapValues } = require('lodash');

const parsing = require('../../../parsing');
const { transtype } = require('../../../utilities');


// Retrieves query variables
const getQueryVars = function ({ specific, protocol }) {
  // Query parameters
  const queryVars = parsing[protocol].queryString.parse({ specific });

  // Tries to guess parameter types, e.g. '15' -> 15
  const transtypedQueryVars = mapValues(queryVars, value => transtype(value));

  return transtypedQueryVars;
};


module.exports = {
  getQueryVars,
};
