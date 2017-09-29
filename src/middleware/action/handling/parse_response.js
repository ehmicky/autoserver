'use strict';

const parseResponse = function ({ response }) {
  const data = removeTopLevel({ response });
  const type = getResponseType({ data });

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

const getResponseType = function ({ data }) {
  return Array.isArray(data) ? 'collection' : 'model';
};

module.exports = {
  parseResponse,
};
