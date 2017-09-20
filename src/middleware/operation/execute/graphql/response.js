'use strict';

const parseResponse = function ({ fullResponse }) {
  const data = removeTopLevel({ fullResponse });
  const type = getResponseType({ data });

  return {
    content: { data },
    type,
  };
};

// Remove top-level key, e.g. `findModels`
const removeTopLevel = function ({ fullResponse }) {
  const topLevelKeys = Object.keys(fullResponse);

  // Empty response
  if (topLevelKeys.length === 0) { return []; }

  return fullResponse[topLevelKeys[0]];
};

const getResponseType = function ({ data }) {
  return Array.isArray(data) ? 'collection' : 'model';
};

module.exports = {
  parseResponse,
};
