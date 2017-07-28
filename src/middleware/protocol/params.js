'use strict';

const { camelize } = require('underscore.string');

const {
  transtype,
  mapValues,
  mapKeys,
  pickBy,
  makeImmutable,
} = require('../../utilities');
const { addJsl } = require('../../jsl');
const { addLogInfo } = require('../../logging');

// Fill in `input.params`, which are custom application-specific information,
// defined by the library user, not by the API engine.
// They can be defined:
//  - in headers, namespaced, i.e. 'X-Api-Engine-Param-My-Param'
//  - in query string, using `params.myParam`
// Values are automatically transtyped.
// Are set to JSL param $PARAMS
const parseParams = async function (nextFunc, input) {
  const params = getParams({ input });
  makeImmutable(params);

  const newInput = addJsl(input, { $PARAMS: params });
  const loggedInput = addLogInfo(newInput, { params });
  const nextInput = Object.assign({}, loggedInput, { params });

  const response = await nextFunc(nextInput);
  return response;
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
  const paramHeaders = pickBy(headers, (value, name) =>
    PARAMS_NAME_REGEXP.test(name)
  );
  return mapKeys(paramHeaders, (header, name) => {
    const shortName = name.replace(PARAMS_NAME_REGEXP, '');
    return camelize(shortName, true);
  });
};

const PARAMS_NAME_REGEXP = /x-api-engine-param-/i;

module.exports = {
  parseParams,
};
