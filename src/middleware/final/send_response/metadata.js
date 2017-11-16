'use strict';

const { pick } = require('../../../utilities');
const { MODEL_TYPES } = require('../../../constants');

// Add response's metadata
const addMetadata = function ({
  response,
  response: { type, content },
  metadata,
}) {
  const hasMetadata = MODEL_TYPES.includes(type) &&
    content &&
    content.constructor === Object;
  if (!hasMetadata) { return response; }

  const metadataA = filterMetadata({ type, metadata });

  const contentA = { ...content, metadata: metadataA };
  return { ...response, content: contentA };
};

// Some metadata only make sense in success responses, e.g. pagination
const filterMetadata = function ({ type, metadata }) {
  if (type !== 'error') { return metadata; }

  return pick(metadata, ERROR_METADATA);
};

// Metadata allowed in error responses
const ERROR_METADATA = [
  'requestid',
  'servername',
  'serverid',
  'responsetime',
];

module.exports = {
  addMetadata,
};
