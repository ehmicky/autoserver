'use strict';


const parsing = require('../../../parsing');
const { EngineError } = require('../../../error');


/**
 * Returns an request payload
 *
 * @param {object} options
 * @param {Request} options.req
 * @returns {any} value - type differs according to Content-Type,
 *                        e.g. application/json is object but
 *                        text/plain is string
 */
const getPayload = async function ({ specific, protocol, headers }) {
  if (!parsing[protocol].body.hasPayload({ specific })) { return; }

  for (let i = 0; i < payloadHandlers.length; i++) {
    let body = await payloadHandlers[i]({ specific, protocol });
    if (body) { return body; }
  }

  // Wrong request errors
  const contentType = headers['content-type'];
  if (!contentType) {
    const message = 'Must specify Content-Type when sending a request body';
    throw new EngineError(message, { reason: 'NO_CONTENT_TYPE' });
  }
  const message = `Unsupported Content-Type: ${contentType}`;
  throw new EngineError(message, { reason: 'WRONG_CONTENT_TYPE' });
};

// Request payload middleware, for several types of input
const payloadHandlers = [

  // application/graphql request body
  async function ({ specific, protocol }) {
    const textBody = await parsing[protocol].body.parse.graphql({ specific });
    return textBody ? { query: textBody } : null;
  },

  // JSON request body
  async function ({ specific, protocol }) {
    return await parsing[protocol].body.parse.json({ specific });
  },

  // x-www-form-urlencoded request body
  async function ({ specific, protocol }) {
    return await parsing[protocol].body.parse.urlencoded({ specific });
  },

  // string request body
  async function ({ specific, protocol }) {
    const textBody = await parsing[protocol].body.parse.text({ specific });
    return typeof textBody === 'string' ? null : textBody;
  },

  // binary request body
  async function ({ specific, protocol }) {
    const rawBody = await parsing[protocol].body.parse.raw({ specific });
    return rawBody instanceof Buffer ? rawBody.toString() : null;
  },

];


module.exports = {
  getPayload,
};
