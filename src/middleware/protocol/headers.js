'use strict';


const { mapValues } = require('lodash');

const parsing = require('../../parsing');
const { transtype } = require('../../utilities');


// Fill in `input.headers` using protocol-specific headers.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used to create (in coming middleware) `input.settings` and
// `input.params`, but can also be used by operation layer as is.
// Fill in `input.params`, which are custom application-specific information,
// defined by the library user, not by the API engine.
// They can be defined:
//  - in headers, namespaced, e.g. 'X-ProjectName-PARAM',
//    using `serverOpts.projectName`
//  - in query string, using `params.PARAM`
// Are set to JSL param $PARAMS
// Fill in `input.settings`, which are settings which apply to the whole
// operation. The list is predefined by the API engine.
// They can be defined:
//  - in headers, namespaced, e.g. 'X-ApiEngine-PARAM'
//  - in query string, using `settings.PARAM`
// Redundant protocol-specific headers might exist for some settings.
// E.g. settings 'noOutput' can be defined using
// HTTP header Prefer: return=minimal
// Are set to JSL param $SETTINGS
const parseHeaders = function (opts) {
  const { projectName } = opts;

  return async function parseHeaders(input) {
    const { specific, jsl, protocol, log } = input;
    const perf = log.perf.start('protocol.parseHeaders', 'middleware');

    const { params, headers } = getHeaders({ specific, protocol, projectName });

    const newJsl = jsl.add({ $PARAMS: params });

    log.add({ headers, params });
    Object.assign(input, { headers, params, jsl: newJsl });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

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
  parseHeaders,
};
