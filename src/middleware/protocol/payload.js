'use strict';


const parsing = require('../../parsing');
const { EngineError } = require('../../error');
const { makeImmutable } = require('../../utilities');


// Fill in `input.payload` using protocol-specific request payload.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used by operation layer, e.g. to populate `input.args`
const parsePayload = function () {
  return async function parsePayload(input) {
    const { specific, protocol, log } = input;
    const perf = log.perf.start('protocol.parsePayload', 'middleware');

    const payload = await getPayload({ specific, protocol });
    makeImmutable(payload);

    log.add({ payload });
    Object.assign(input, { payload });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

// Returns an request payload
//
// @param {object} options
// @param {Request} options.req
// @returns {any} value - type differs according to Content-Type,
//                        e.g. application/json is object but
//                        text/plain is string
const getPayload = async function ({ specific, protocol }) {
  if (!parsing[protocol].payload.hasPayload({ specific })) { return; }

  const parse = parsing[protocol].payload.parse;
  for (const payloadHandler of payloadHandlers) {
    const payload = await payloadHandler({ specific, parse });
    if (payload !== undefined) { return payload; }
  }

  payloadError({ specific, protocol });
};

// There is a payload, but it could not be read
const payloadError = function ({ specific, protocol }) {
  const contentType = parsing[protocol].payload.getContentType({ specific });
  if (!contentType) {
    const message = 'Must specify Content-Type when sending a request payload';
    throw new EngineError(message, { reason: 'NO_CONTENT_TYPE' });
  }
  const message = `Unsupported Content-Type: '${contentType}'`;
  throw new EngineError(message, { reason: 'WRONG_CONTENT_TYPE' });
};

// Request payload middleware, for several types of input
const payloadHandlers = [

  // application/graphql request payload
  async function ({ specific, parse }) {
    const textPayload = await parse.graphql({ specific });
    return textPayload ? { query: textPayload } : undefined;
  },

  // JSON request payload
  async function ({ specific, parse }) {
    return await parse.json({ specific });
  },

  // x-www-form-urlencoded request payload
  async function ({ specific, parse }) {
    return await parse.urlencoded({ specific });
  },

  // string request payload
  async function ({ specific, parse }) {
    const textPayload = await parse.text({ specific });
    return typeof textPayload === 'string' ? undefined : textPayload;
  },

  // binary request payload
  async function ({ specific, parse }) {
    const rawPayload = await parse.raw({ specific });
    return rawPayload instanceof Buffer ? rawPayload.toString() : undefined;
  },

];


module.exports = {
  parsePayload,
};
