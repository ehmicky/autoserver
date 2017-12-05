'use strict';

const { pick, omit } = require('../../../utilities');
const { MODEL_TYPES } = require('../../../constants');
const { getVars } = require('../../../schema_func');

// Add response's metadata
const addMetadata = function ({
  response,
  response: { type, content },
  metadata,
  mInput,
}) {
  const shouldAddMetadata = MODEL_TYPES.includes(type);
  if (!shouldAddMetadata) { return response; }

  const metadataA = filterMetadata({ type, metadata, mInput });

  return { ...response, content: { data: content, metadata: metadataA } };
};

// Some metadata only make sense in success responses, e.g. pagination
const filterMetadata = function ({ type, metadata, mInput }) {
  if (type !== 'error') { return metadata; }

  const metadataA = pick(metadata, ERROR_METADATA);

  const info = getVars(mInput);
  const infoA = omit(info, HIDDEN_ERROR_INFO);

  return { ...metadataA, info: infoA };
};

// Metadata allowed in error responses
const ERROR_METADATA = [
  'requestid',
  'duration',
];

// Schema variables not allowed in error response
const HIDDEN_ERROR_INFO = [
  // Avoid duplicate information
  ...ERROR_METADATA,
  'serverinfo',
  'metadata',
];

module.exports = {
  addMetadata,
};
