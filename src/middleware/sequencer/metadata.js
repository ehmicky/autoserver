'use strict';

const { deepMerge } = require('../../utilities');

// Deep merge all results' metadata
const mergeMetadata = function ({ results, metadata }) {
  const metadataA = results.map(result => result.metadata);
  const metadataB = deepMerge(metadata, ...metadataA);
  return { metadata: metadataB };
};

module.exports = {
  mergeMetadata,
};
