'use strict';

const { applyResponseAliases } = require('./response');

// Apply `alias` in server output
const applyOutputAliases = function ({ response, modelAliases }) {
  return Object.entries(modelAliases).reduce(
    (responseA, [attrName, aliases]) =>
      applyOutputAlias({ response: responseA, attrName, aliases }),
    response,
  );
};

const applyOutputAlias = function ({
  response,
  response: { data },
  attrName,
  aliases,
}) {
  const dataA = applyResponseAliases({ data, attrName, aliases });
  return { ...response, data: dataA };
};

module.exports = {
  applyOutputAliases,
};
