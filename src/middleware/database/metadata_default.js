'use strict';

// Add default empty response.metadata
const addMetadataDefault = function ({
  response,
  response: { data, metadata },
}) {
  if (metadata !== undefined) { return; }

  const metadataA = Array(data.length).fill({});
  return { response: { ...response, metadata: metadataA } };
};

module.exports = {
  addMetadataDefault,
};
