'use strict';

const { applyResponseAliases } = require('./response');

// Apply `alias` in server output
const applyOutputAliases = function ({ response, modelAliases }) {
  for (const [attrName, aliases] of Object.entries(modelAliases)) {
    applyOutputAlias({ response, attrName, aliases });
  }
};

const applyOutputAlias = function ({ response, attrName, aliases }) {
  const { data } = response;
  response.data = applyResponseAliases({ data, attrName, aliases });
};

module.exports = {
  applyOutputAliases,
};
