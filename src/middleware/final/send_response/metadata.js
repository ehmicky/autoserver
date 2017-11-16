'use strict';

const { pick } = require('../../../utilities');
const { MODEL_TYPES } = require('../../../constants');

// Add response's metadata
const addMetadata = function ({
  response,
  response: { type, content },
  metadata,
}) {
  const shouldAddMetadata = MODEL_TYPES.includes(type);
  if (!shouldAddMetadata) { return response; }

  const metadataA = filterMetadata({ type, metadata });

  return { ...response, content: { data: content, metadata: metadataA } };
};

// Some metadata only make sense in success responses, e.g. pagination
const filterMetadata = function ({ type, metadata }) {
  if (type !== 'error') { return metadata; }

  return pick(metadata, ERROR_METADATA);
};

// Metadata allowed in error responses
const ERROR_METADATA = [
  'requestid',
  'serverid',
  'responsetime',
];

module.exports = {
  addMetadata,
};
