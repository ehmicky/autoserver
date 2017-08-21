'use strict';

const { applyResponseAliases } = require('./response');

// Apply `alias` in server output
const applyOutputAliases = function ({ input, modelAliases }) {
  return Object.entries(modelAliases).reduce(
    (inputA, [attrName, aliases]) =>
      applyOutputAlias({ input: inputA, attrName, aliases }),
    input,
  );
};

const applyOutputAlias = function ({
  input,
  input: { response, response: { data } },
  attrName,
  aliases,
}) {
  const dataA = applyResponseAliases({ data, attrName, aliases });
  const responseA = { ...response, data: dataA };
  return { ...input, response: responseA };
};

module.exports = {
  applyOutputAliases,
};
