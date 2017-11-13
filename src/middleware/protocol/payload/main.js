'use strict';

const { promiseThen } = require('../../../utilities');
const { getLimits } = require('../../../limits');

const { getRawPayload } = require('./raw');
const { getFormat } = require('./format');
const { parseCharset } = require('./charset');
const { fireParser } = require('./parse');

// Fill in `mInput.payload` using protocol-specific request payload.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used by rpc layer, e.g. to populate `mInput.args`
const parsePayload = function ({ specific, protocolHandler, runOpts }) {
  if (!protocolHandler.hasPayload({ specific })) { return; }

  const { maxpayload } = getLimits({ runOpts });

  const promise = getRawPayload({ protocolHandler, specific, maxpayload });

  return promiseThen(
    promise,
    parseContent.bind(null, { specific, protocolHandler }),
  );
};

const parseContent = function ({ specific, protocolHandler }, payload) {
  const format = getFormat({ specific, protocolHandler });

  const payloadA = parseCharset({ payload, specific, protocolHandler, format });

  const payloadB = fireParser({ payload: payloadA, format });

  return { payload: payloadB };
};

module.exports = {
  parsePayload,
};
