'use strict';

const { getSumParams } = require('../../../utilities');
const { addGenErrorHandler } = require('../../../errors');
const { getLimits } = require('../../../limits');
const { validateBoolean } = require('../validate');

const { getRawPayload } = require('./raw');

// Fill in `mInput.payload` using protocol-specific request payload.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used by rpc layer, e.g. to populate `mInput.args`
const parsePayload = function ({
  protocolAdapter,
  specific,
  config,
  charset,
  format,
  compressRequest,
}) {
  const hasPayload = protocolAdapter.hasPayload({ specific });
  validateBoolean(hasPayload, 'hasPayload');

  if (!hasPayload) { return; }

  return parseRawPayload({
    specific,
    protocolAdapter,
    config,
    format,
    charset,
    compressRequest,
  });
};

const parseRawPayload = async function ({
  specific,
  protocolAdapter,
  config,
  format,
  charset,
  compressRequest,
}) {
  const { maxpayload } = getLimits({ config });
  const payload = await getRawPayload({
    protocolAdapter,
    specific,
    maxpayload,
  });

  const payloadA = await eDecompressPayload({ compressRequest, payload });

  const payloadB = eDecodeCharset({ content: payloadA, charset });

  const payloadC = eParseContent({ payload: payloadB, format });

  // `payloadsize` and `payloadcount` parameters
  const sumParams = getSumParams({ attrName: 'payload', value: payloadC });

  return { payload: payloadC, ...sumParams };
};

// Request body decompression
const decompressPayload = function ({ compressRequest, payload }) {
  return compressRequest.decompress(payload);
};

const eDecompressPayload = addGenErrorHandler(decompressPayload, {
  message: ({ compressRequest: { name } }) =>
    `Invalid compression algorithm for the request payload: '${name}'`,
  reason: 'PAYLOAD_NEGOTIATION',
});

const decodeCharset = function ({ content, charset }) {
  return charset.decode(content);
};

const eDecodeCharset = addGenErrorHandler(decodeCharset, {
  message: ({ charset }) =>
    `Invalid request charset: '${charset}' could not be decoded`,
  reason: 'PAYLOAD_NEGOTIATION',
});

// Parse content, e.g. JSON/YAML parsing
const parseContent = function ({ format, payload }) {
  return format.parseContent(payload);
};

const getMessage = function ({ format: { title }, payload }) {
  if (!payload) {
    return 'The request payload is empty';
  }

  return `The request payload is invalid ${title}`;
};

const eParseContent = addGenErrorHandler(parseContent, {
  message: getMessage,
  reason: 'PAYLOAD_NEGOTIATION',
});

module.exports = {
  parsePayload,
};
