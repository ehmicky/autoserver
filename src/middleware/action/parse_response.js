'use strict';

// Add content type, and remove top-level key
// Also add metadata
const parseResponse = function ({ response, metadata }) {
  const data = removeTopLevel({ response });
  const type = getResponsetype({ data });

  const responseA = { content: { data, metadata }, type };
  return { response: responseA };
};

// Remove top-level key, e.g. `find_collection`
const removeTopLevel = function ({ response }) {
  const [topLevelKey] = Object.keys(response);

  // Empty response
  if (topLevelKey === undefined) { return []; }

  return response[topLevelKey];
};

const getResponsetype = function ({ data }) {
  return Array.isArray(data) ? 'models' : 'model';
};

module.exports = {
  parseResponse,
};
