'use strict';


const { mapValues } = require('lodash');

const { httpHeaders } = require('../../../../parsing');
const { transtype } = require('../../../../utilities');


// Retrieves HTTP headers, namespaced (`params`) or not (`headers`)
const getHeaders = function ({ req, projectName }) {
  const { nonAppHeaders, appHeaders } = httpHeaders.parse(req, projectName);

  // Tries to guess parameter types, e.g. '15' -> 15
  const params = mapValues(appHeaders, value => transtype(value));
  const headers = mapValues(nonAppHeaders, value => transtype(value));

  return { params, headers };
};


module.exports = {
  getHeaders,
};
