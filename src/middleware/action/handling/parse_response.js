'use strict';

const parseResponse = function ({ response }) {
  const data = removeTopLevel({ response });
  const type = getResponseType({ data });

  return { content: { data }, type };
};

// Remove top-level key, e.g. `findModels`
const removeTopLevel = function ({ response }) {
  const [topLevelKey] = Object.keys(response);

  // Empty response
  if (topLevelKey === undefined) { return []; }

  return response[topLevelKey];
};

const getResponseType = function ({ data }) {
  return Array.isArray(data) ? 'collection' : 'model';
};

module.exports = {
  parseResponse,
};
