'use strict';

const { EngineError } = require('../../error');
const { makeImmutable } = require('../../utilities');

// Fill in `input.payload` using protocol-specific request payload.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used by operation layer, e.g. to populate `input.args`
const parsePayload = async function (input) {
  const { specific, protocolHandler, log } = input;
  const perf = log.perf.start('protocol.parsePayload', 'middleware');

  const payload = await getPayload({ specific, protocolHandler });
  makeImmutable(payload);

  log.add({ payload });
  Object.assign(input, { payload });

  perf.stop();
  const response = await this.next(input);
  return response;
};

// Returns an request payload
//
// @param {object} options
// @param {Request} options.req
// @returns {any} value - type differs according to Content-Type,
//                        e.g. application/json is object but
//                        text/plain is string
const getPayload = async function ({ specific, protocolHandler }) {
  if (!protocolHandler.hasPayload({ specific })) { return; }

  const parse = protocolHandler.parsePayload;

  for (const payloadHandler of payloadHandlers) {
    // eslint-disable-next-line no-await-in-loop
    const payload = await payloadHandler({ specific, parse });
    if (payload !== undefined) { return payload; }
  }

  payloadError({ specific, protocolHandler });
};

// There is a payload, but it could not be read
const payloadError = function ({ specific, protocolHandler }) {
  const contentType = protocolHandler.getContentType({ specific });

  if (!contentType) {
    const msg = 'Must specify Content-Type when sending a request payload';
    throw new EngineError(msg, { reason: 'NO_CONTENT_TYPE' });
  }

  const message = `Unsupported Content-Type: '${contentType}'`;
  throw new EngineError(message, { reason: 'WRONG_CONTENT_TYPE' });
};

// Request payload middleware, for several types of input
const payloadHandlers = [

  // `application/graphql` request payload
  async function graphqlHandler ({ specific, parse }) {
    const payload = await parse.graphql({ specific });
    return payload ? { query: payload } : undefined;
  },

  // JSON request payload
  async function jsonHandler ({ specific, parse }) {
    const payload = await parse.json({ specific });
    return payload;
  },

  // `x-www-form-urlencoded` request payload
  async function urlencodedHandler ({ specific, parse }) {
    const payload = await parse.urlencoded({ specific });
    return payload;
  },

  // String request payload
  async function textHandler ({ specific, parse }) {
    const payload = await parse.text({ specific });
    return typeof payload === 'string' ? undefined : payload;
  },

  // Binary request payload
  async function rawHandler ({ specific, parse }) {
    const payload = await parse.raw({ specific });
    return payload instanceof Buffer ? payload.toString() : undefined;
  },

];

module.exports = {
  parsePayload,
};
