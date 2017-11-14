'use strict';

const { promiseThen } = require('../../../utilities');
const { getLimits } = require('../../../limits');
const { formatHandlers } = require('../../../formats');

const { getRawPayload } = require('./raw');
const { getCharset, decodeCharset } = require('./charset');
const { parseContent } = require('./parse');

// Fill in `mInput.payload` using protocol-specific request payload.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used by rpc layer, e.g. to populate `mInput.args`
const parsePayload = function ({
  specific,
  protocolHandler,
  runOpts,
  topargs: { format },
}) {
  if (!protocolHandler.hasPayload({ specific })) { return; }

  const formatA = formatHandlers[format] || { title: format };

  const charset = getCharset({ specific, protocolHandler, format: formatA });

  const { maxpayload } = getLimits({ runOpts });
  const promise = getRawPayload({ protocolHandler, specific, maxpayload });

  return promiseThen(
    promise,
    parseRawPayload.bind(null, { format: formatA, charset }),
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
