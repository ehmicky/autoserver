'use strict';

// Add content type, and remove top-level key
// Also add metadata
const parseResponse = function ({ response }) {
  const content = removeTopLevel({ response });
  const type = getResponsetype({ content });

  const responseA = { content, type };
  return { response: responseA };
};

// Remove top-level key, e.g. `find_collection`
const removeTopLevel = function ({ response }) {
  const [topLevelKey] = Object.keys(response);

  // Empty response
  if (topLevelKey === undefined) { return []; }

  return response[topLevelKey];
};

const getResponsetype = function ({ content }) {
  return Array.isArray(content) ? 'models' : 'model';
};

module.exports = {
  parseResponse,
};
