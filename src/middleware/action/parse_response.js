'use strict';

// Add content type, and remove top-level key
const parseResponse = function ({ response }) {
  const data = removeTopLevel({ response });
  const type = getResponsetype({ data });

  const responseA = { content: { data }, type };
  return { response: responseA };
};

// Remove top-level key, e.g. `findModels`
const removeTopLevel = function ({ response }) {
  const [topLevelKey] = Object.keys(response);

  // Empty response
  if (topLevelKey === undefined) { return []; }

  return response[topLevelKey];
};

const getResponsetype = function ({ data }) {
  return Array.isArray(data) ? 'collection' : 'model';
};

module.exports = {
  parseResponse,
};
