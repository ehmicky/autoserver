'use strict';

const { pick, omit } = require('../../../utilities');
const { MODEL_TYPES, ERROR_TYPES } = require('../../../constants');
const { getVars, reduceVars } = require('../../../functions');

// Add response's metadata
const addMetadata = function ({
  response,
  response: { type, content },
  metadata,
  mInput,
}) {
  if (ERROR_TYPES.includes(type)) {
    return getErrorMetadata({ response, metadata, mInput });
  }

  if (MODEL_TYPES.includes(type)) {
    return { ...response, content: { data: content, metadata } };
  }

  return response;
};

const getErrorMetadata = function ({
  response,
  response: { type, content },
  metadata,
  mInput,
}) {
  if (!ERROR_TYPES.includes(type)) { return metadata; }

  const metadataA = pick(metadata, ERROR_METADATA);

  const vars = getVars(mInput, { client: true });
  const varsA = omit(vars, HIDDEN_ERROR_INFO);
  const varsB = reduceVars({ vars: varsA });

  const metadataB = { ...metadataA, info: varsB };

  return { ...response, content: { error: content, metadata: metadataB } };
};

// Some metadata only make sense in success responses, e.g. pagination
const ERROR_METADATA = [
  'requestid',
  'duration',
];

// Config variables not allowed in error response
const HIDDEN_ERROR_INFO = [
  // Avoid duplicate information
  ...ERROR_METADATA,
  'metadata',

  // For security reasons
  'serverinfo',
];

module.exports = {
  addMetadata,
};
