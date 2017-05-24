'use strict';


const { mapValues } = require('lodash');

const { httpQueryString } = require('../../../../parsing');
const { transtype } = require('../../../../utilities');


// Retrieves HTTP query variables
const getQueryVars = function ({ req }) {
  // Query parameters
  const queryVars = httpQueryString.parse(req.url);

  // Tries to guess parameter types, e.g. '15' -> 15
  const transtypedQueryVars = mapValues(queryVars, value => transtype(value));

  return transtypedQueryVars;
};


module.exports = {
  getQueryVars,
};
