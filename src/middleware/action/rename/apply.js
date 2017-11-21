'use strict';

const { get, set, mapKeys } = require('../../../utilities');

// Rename fields if the output key is different from the database one,
// using `arg.rename`, including with GraphQL aliases.
const applyRename = function ({ response, results }) {
  // Need to recurse through children first
  const responseA = results.reduceRight(renameFieldsByResult, response);
  return { response: responseA };
};

const renameFieldsByResult = function (
  response,
  { path, action: { args: { rename } } },
) {
  if (rename === undefined) { return response; }

  const model = get(response, path);
  const modelA = renameAttrs({ model, rename });

  const responseA = set(response, path, modelA);
  return responseA;
};

const renameAttrs = function ({ model, rename }) {
  const renameA = rename.map(({ key, outputName }) => ({ [key]: outputName }));
  const renameB = Object.assign({}, ...renameA);

  const modelA = mapKeys(model, (value, name) => renameB[name] || name);
  return modelA;
};

module.exports = {
  applyRename,
};
