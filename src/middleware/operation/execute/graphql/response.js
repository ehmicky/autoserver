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
  const [topLevelKey] = Object.keys(fullResponse);
  return fullResponse[topLevelKey];
};

const getResponseType = function ({ data }) {
  return Array.isArray(data) ? 'collection' : 'model';
};

module.exports = {
  parseResponse,
};
