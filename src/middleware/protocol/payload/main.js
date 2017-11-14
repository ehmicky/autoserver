'use strict';

const { decode } = require('iconv-lite');

const { promiseThen } = require('../../../utilities');
const { addGenErrorHandler } = require('../../../error');
const { getLimits } = require('../../../limits');
const { formatHandlers, getCharset, parse } = require('../../../formats');

const { getRawPayload } = require('./raw');

// Fill in `mInput.payload` using protocol-specific request payload.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used by rpc layer, e.g. to populate `mInput.args`
const parsePayload = function ({
  specific,
  protocolHandler,
  runOpts,
  topargs: { charset, format },
}) {
  if (!protocolHandler.hasPayload({ specific })) { return; }

  const formatA = formatHandlers[format] || { title: format };
  const charsetA = getCharset({ format: formatA, charset });

  const { maxpayload } = getLimits({ runOpts });
  const promise = getRawPayload({ protocolHandler, specific, maxpayload });

  return promiseThen(
    promise,
    parseRawPayload.bind(null, { format: formatA, charset: charsetA }),
  );
};

const parseRawPayload = function ({ format, charset }, payload) {
  const payloadA = eDecode(payload, charset);

  const payloadB = eParseContent({ payload: payloadA, format });

  return { payload: payloadB };
};

// Charset decoding is done in a protocol-agnostic way
const eDecode = addGenErrorHandler(decode, {
  message: ({ charset }) => `The request payload is invalid: the charset '${charset}' could not be decoded`,
  reason: 'WRONG_CONTENT_TYPE',
});

// Parse content, e.g. JSON/YAML parsing
const parseContent = function ({ format: { name }, payload }) {
  if (name === undefined) { return payload; }

  return parse({ format: name, content: payload });
};

const eParseContent = addGenErrorHandler(parseContent, {
  message: ({ format: { title } }) => `The request payload is invalid ${title}`,
  reason: 'WRONG_CONTENT_TYPE',
});

module.exports = {
  parsePayload,
};
