'use strict';


const { camelize } = require('underscore.string');

const { transtype, mapValues, assignObject } = require('../../utilities');


// Fill in `input.params`, which are custom application-specific information,
// defined by the library user, not by the API engine.
// They can be defined:
//  - in headers, namespaced, i.e. 'X-Api-Engine-Param-My-Param'
//  - in query string, using `params.myParam`
// Values are automatically transtyped.
// Are set to JSL param $PARAMS
const parseParams = function () {
  return async function parseParams(input) {
    const { jsl, log } = input;
    const perf = log.perf.start('protocol.parseParams', 'middleware');

    const params = getParams({ input });

    const newJsl = jsl.add({ $PARAMS: params });

    log.add({ params });
    Object.assign(input, { params, jsl: newJsl });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

const getParams = function ({ input }) {
  const queryParams = getQueryParams({ input });
  const headersParams = getHeadersParams({ input });
  const params = Object.assign({}, queryParams, headersParams);

  const transtypedParams = mapValues(params, value => transtype(value));

  return transtypedParams;
};

// Retrieves ?params.myParam query variables
const getQueryParams = function ({ input: { queryVars: { params } } }) {
  return params;
};

// Filters headers with only the headers whose name starts
// with X-Api-Engine-Param-My-Param
const getHeadersParams = function ({ input: { headers } }) {
  return Object.entries(headers)
    .filter(([name]) => PARAMS_NAME_REGEXP.test(name))
    .map(([name, value]) => {
      const shortName = name.replace(PARAMS_NAME_REGEXP, '');
      const key = camelize(shortName, true);
      return { [key]: value };
    })
    .reduce(assignObject, {});
};

const PARAMS_NAME_REGEXP = /x-api-engine-param-/i;


module.exports = {
  parseParams,
};
