'use strict';


const { httpBody } = require('../../../../parsing');
const { EngineError } = require('../../../../error');


/**
 * Returns an HTTP request payload
 *
 * @param {object} options
 * @param {Request} options.req
 * @returns {any} value - type differs according to Content-Type,
 *                        e.g. application/json is object but
 *                        text/plain is string
 */
const getPayload = async function ({ req, headers }) {
  if (!hasPayload({ headers })) { return; }

  for (let i = 0; i < payloadHandlers.length; i++) {
    let body = await payloadHandlers[i](req);
    if (body) { return body; }
  }

  // Wrong request errors
  const contentType = headers['content-type'];
  if (!contentType) {
    const message = 'Must specify Content-Type when sending an HTTP request body';
    throw new EngineError(message, { reason: 'HTTP_NO_CONTENT_TYPE' });
  }
  const message = `Unsupported Content-Type: ${contentType}`;
  throw new EngineError(message, { reason: 'HTTP_WRONG_CONTENT_TYPE' });
};

const hasPayload = function ({ headers }) {
  return Number(headers['content-length']) > 0
    || headers['transfer-encoding'] !== undefined;
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
  getPayload,
};
