'use strict';

const { promiseThen } = require('../../../utilities');
const { getLimits } = require('../../../limits');

const { getRawPayload } = require('./raw');
const { getFormat } = require('./format');
const { getCharset, decodeCharset } = require('./charset');
const { parseContent } = require('./parse');

// Fill in `mInput.payload` using protocol-specific request payload.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used by rpc layer, e.g. to populate `mInput.args`
const parsePayload = function ({ specific, protocolHandler, runOpts }) {
  if (!protocolHandler.hasPayload({ specific })) { return; }

  const format = getFormat({ specific, protocolHandler });

  const charset = getCharset({ specific, protocolHandler, format });

  const { maxpayload } = getLimits({ runOpts });
  const promise = getRawPayload({ protocolHandler, specific, maxpayload });

  return promiseThen(
    promise,
    parseRawPayload.bind(null, { format, charset }),
  );
};

const parseRawPayload = function ({ format, charset }, payload) {
  const payloadA = decodeCharset(payload, charset);

  const payloadB = parseContent({ payload: payloadA, format });

  return { payload: payloadB };
};

module.exports = {
  parsePayload,
};
