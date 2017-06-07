'use strict';


const { mapValues } = require('lodash');

const parsing = require('../../../parsing');
const { transtype } = require('../../../utilities');


// Retrieves headers, namespaced (`params`) or not (`headers`)
const getHeaders = function ({ specific, protocol, projectName }) {
  const {
    nonAppHeaders,
    appHeaders,
  } = parsing[protocol].headers.parse({ specific, projectName });

  // Tries to guess parameter types, e.g. '15' -> 15
  const params = mapValues(appHeaders, value => transtype(value));
  const headers = mapValues(nonAppHeaders, value => transtype(value));

  return { params, headers };
};


module.exports = {
  getHeaders,
};
