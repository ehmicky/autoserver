'use strict';

const { throwError } = require('../../error');
const { reduceAsync } = require('../../utilities');

// Fill in `mInput.payload` using protocol-specific request payload.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used by operation layer, e.g. to populate `mInput.args`
// Returns an request payload
const parsePayload = async function ({ specific, protocolHandler }) {
  if (!protocolHandler.hasPayload({ specific })) { return; }

  const parse = protocolHandler.parsePayload;
  const payload = await reduceAsync(
    payloadHandlers,
    tryPayloadHandler.bind(null, { specific, parse }),
    undefined,
  );

  const payloadB = validatePayload({ payload, specific, protocolHandler });

  return { payload: payloadB };
};

const tryPayloadHandler = function (
  { specific, parse },
  payload,
  payloadHandler,
) {
  if (payload !== undefined) { return payload; }
  return payloadHandler({ specific, parse });
};

// Request payload middleware, for several types of mInput
const payloadHandlers = [

  // `application/graphql` request payload
  async function graphqlHandler ({ specific, parse }) {
    const payload = await parse.graphql({ specific });
    return payload ? { query: payload } : undefined;
  },

  // JSON request payload
  function jsonHandler ({ specific, parse }) {
    return parse.json({ specific });
  },

  // `x-www-form-urlencoded` request payload
  function urlencodedHandler ({ specific, parse }) {
    return parse.urlencoded({ specific });
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

// There is a payload, but it could not be read
const validatePayload = function ({ payload, specific, protocolHandler }) {
  if (payload !== undefined) { return payload; }

  const contentType = protocolHandler.getContentType({ specific });

  if (!contentType) {
    const msg = 'Must specify Content-Type when sending a request payload';
    throwError(msg, { reason: 'NO_CONTENT_TYPE' });
  }

  const message = `Unsupported Content-Type: '${contentType}'`;
  throwError(message, { reason: 'WRONG_CONTENT_TYPE' });
};

module.exports = {
  parsePayload,
};
