'use strict';

const { applyResponseAliases } = require('./response');

// Apply `alias` in server output
const applyOutputAliases = function ({ response, modelAliases }) {
  const responseB = Object.entries(modelAliases).reduce(
    (responseA, [attrName, aliases]) =>
      applyOutputAlias({ response: responseA, attrName, aliases }),
    response,
  );
  return { response: responseB };
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
