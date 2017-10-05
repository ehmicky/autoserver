'use strict';

const { is: isType } = require('type-is');

const { promiseThen } = require('../../utilities');
const { throwError } = require('../../error');
const { PAYLOAD_TYPES } = require('../../constants');
const { getLimits } = require('../../limits');

// Fill in `mInput.payload` using protocol-specific request payload.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used by operation layer, e.g. to populate `mInput.args`
const parsePayload = function ({
  specific,
  protocolHandler,
  operationHandler,
  runOpts,
}) {
  if (!protocolHandler.hasPayload({ specific })) { return; }

  const type = getPayloadType({ specific, protocolHandler, operationHandler });

  // Use protocol-specific way to parse payload, using a known type
  const { maxPayloadSize } = getLimits({ runOpts });
  const payloadPromise = protocolHandler.parsePayload({
    type,
    specific,
    maxPayloadSize,
  });

  return promiseThen(payloadPromise, processPayload.bind(null, type));
};

// Find the payload type, among the possible ones available in `PAYLOAD_TYPES`
const getPayloadType = function ({
  specific,
  protocolHandler,
  operationHandler: { payload: operationPayload = {} },
}) {
  const contentType = getContentType({ specific, protocolHandler });

  // Check the content-type header against hard-coded MIME types
  const payloadTypeA = PAYLOAD_TYPES.find(payloadType => payloadTypeMatches({
    payloadType,
    operationPayload,
    contentType,
  }));

  if (!payloadTypeA) {
    const message = `Unsupported Content-Type: '${contentType}'`;
    throwError(message, { reason: 'WRONG_CONTENT_TYPE' });
  }

  return payloadTypeA.type;
};

// Use protocol-specific way to retrieve the content type header
const getContentType = function ({ specific, protocolHandler }) {
  const contentType = protocolHandler.getContentType({ specific });

  if (!contentType) {
    const msg = 'Must specify Content-Type when sending a request payload';
    throwError(msg, { reason: 'NO_CONTENT_TYPE' });
  }

  return contentType;
};

const payloadTypeMatches = function ({
  payloadType: { type, mime },
  operationPayload,
  contentType,
}) {
  // Check also for operation-specific MIME types
  const operationTypes = operationPayload[type] || [];
  const mimeA = [...mime, ...operationTypes];

  return isType(contentType, mimeA);
};

const processPayload = function (type, payload) {
  // Buffer payloads are converted to string
  if (type === 'raw' && payload instanceof Buffer) {
    const payloadA = payload.toString();
    return { payload: payloadA };
  }

  return { payload };
};

module.exports = {
  parsePayload,
};
