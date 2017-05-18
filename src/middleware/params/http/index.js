'use strict';


const { mapValues } = require('lodash');

const {
  httpHeaders,
  httpAppHeaders,
  httpBody,
  httpQueryString,
} = require('../../../parsing');
const { transtype } = require('../../../utilities');
const { EngineError } = require('../../../error');


const fillParams = function () {
  return async function fillParams(input) {
    const { req } = input;
    const method = req.method;
    const params = getParams({ req });
    const payload = await getPayload({ req });

    const output = Object.assign({}, input, { method, params, payload });
    const response = await this.next(output);
    return response;
  };
};


/**
 * Returns an HTTP request parameters (not payload)
 * Does not differentiate from where the input is from
 * (query variables, headers, URL variable)
 * so the next layer can be protocol-agnostic
 *
 * @param {object} options
 * @param {Request} options.req
 *
 * @returns {object} params
 **/
const getParams = function ({ req }) {
  // Query variables
  const queryVars = httpQueryString.parse(req.url);

  // Namespaced HTTP headers
  const appHeaders = httpAppHeaders.parse(req);

  // Merge everything
  const rawParams = Object.assign({}, appHeaders, queryVars);

  // Tries to guess parameter types, e.g. '15' -> 15
  const params = mapValues(rawParams, value => transtype(value));

  return params;
};


/**
 * Returns an HTTP request payload
 *
 * @param {object} options
 * @param {Request} options.req
 * @returns {any} value - type differs according to Content-Type,
 *                        e.g. application/json is object but
 *                        text/plain is string
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
    const message = 'Must specify Content-Type when sending an HTTP request body';
    throw new EngineError(message, { reason: 'HTTP_NO_CONTENT_TYPE' });
  }
  const message = `Unsupported Content-Type: ${contentType}`;
  throw new EngineError(message, { reason: 'HTTP_WRONG_CONTENT_TYPE' });
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
