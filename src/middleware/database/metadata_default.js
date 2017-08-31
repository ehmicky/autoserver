'use strict';

// Add default empty response.metadata
const addMetadataDefault = function ({
  command,
  response,
  response: { data, metadata },
}) {
  if (metadata !== undefined) { return; }

  const metadataA = command.multiple ? Array(data.length).fill({}) : {};
  return { response: { ...response, metadata: metadataA } };
};

module.exports = {
  addMetadataDefault,
};
