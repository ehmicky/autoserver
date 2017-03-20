'use strict';


const { httpHeaders, httpAppHeaders, httpBody, httpQueryString } = require('../../../parsing');
const { transtype } = require('../../../utilities');
const { HttpProtocolError } = require('../../../error/types');


const fillParams = async function (input) {
  const { req, route, pathParams } = input;
  const operation = req.method;
  const params = getParams({ req, pathParams });
  const payload = await getPayload({ req });

  const request = { operation, route, params, payload };
  const response = await this.next(request);
  return response;
};


/**
 * Returns an HTTP request parameters (not payload)
 * Does not differentiate from where the input is from (query variables, headers, URL variable)
 * so the next layer can be protocol-agnostic
 *
 * @param req {Request}
 * @param pathParams {object} URL variables, already provided by previous middleware
 *
 * @returns params {object}
 **/
const getParams = function ({ req, pathParams }) {
  // Query variables
  const queryVars = httpQueryString.parse(req.url);

  // Namespaced HTTP headers
  const appHeaders = httpAppHeaders.parse(req);

  // Merge everything
  const rawParams = Object.assign({}, appHeaders, queryVars, pathParams);

  // Tries to guess parameter types, e.g. '15' -> 15
  const params = Object.keys(rawParams).reduce((allParams, key) => {
    const value = rawParams[key];
    allParams[key] = transtype(value);
    return allParams;
  }, {});

  return params;
};


/**
 * Returns an HTTP request payload
 *
 * @param req {Request}
 * @returns value {any} type differs according to Content-Type, e.g. application/json is object but text/plain is string
 */
const getPayload = async function ({ req }) {
  if (!hasPayload({ req })) { return; }

  for (let i = 0; i < payloadHandlers.length; i++) {
    let body = await payloadHandlers[i](req);
    if (body) { return body; }
  }

  // Wrong request errors
  const contentType = httpHeaders.get(req, 'Content-Type');
  if (!contentType) {
    throw new HttpProtocolError('Must specify Content-Type when sending an HTTP request body', { reason: 'HTTP_NO_CONTENT_TYPE' });
  }
  throw new HttpProtocolError(`Unsupported Content-Type: ${contentType}`, { reason: 'HTTP_WRONG_CONTENT_TYPE' });
};

const hasPayload = function ({ req }) {
  return Number(httpHeaders.get(req, 'Content-Length')) > 0
    || httpHeaders.get(req, 'Transfer-Encoding') !== undefined;
};

// HTTP request payload middleware, for several types of input
const payloadHandlers = [

  // JSON request body
  async function (req) {
    return await httpBody.parse.json(req);
  },

  // x-www-form-urlencoded request body
  async function (req) {
    return await httpBody.parse.urlencoded(req);
  },

  // string request body
  async function (req) {
    const textBody = await httpBody.parse.text(req);
    return typeof textBody === 'string' ? null : textBody;
  },

  // binary request body
  async function (req) {
    const rawBody = await httpBody.parse.raw(req);
    return rawBody instanceof Buffer ? rawBody.toString() : null;
  },

  // application/graphql request body
  async function (req) {
    const textBody = await httpBody.parse.graphql(req);
    return textBody ? { query: textBody } : null;
  },

];


module.exports = {
  httpFillParams: fillParams,
};