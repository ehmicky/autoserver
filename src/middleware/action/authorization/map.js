'use strict';

const { uniq } = require('lodash');

const { assignObject, recurseMap } = require('../../../utilities');
const { runSchemaFunc } = require('../../../schema_func');

// Retrieve `{ MODEL: FILTER_AST }`, i.e. map of `model.authorize` AST,
// per model
const getAuthorizeMap = function ({ actions, schema, mInput }) {
  const modelNames = getModelNames({ actions });
  const authorizeMap = modelNames
    .map(modelName => getAuthorizeFilter({ modelName, schema, mInput }))
    .reduce(assignObject, {});
  return authorizeMap;
};

// Only select the models used in current operation
const getModelNames = function ({ actions }) {
  const modelNames = actions.map(({ modelName }) => modelName);
  const modelNamesA = uniq(modelNames);
  return modelNamesA;
};

const getAuthorizeFilter = function ({
  modelName,
  schema: { models },
  mInput,
}) {
  const { authorize } = models[modelName];
  const authorizeFilter = resolveSchemaFuncs({ authorize, mInput });

  // Do not include model with no `model.authorize`
  if (authorizeFilter === undefined) { return {}; }

  return { [modelName]: authorizeFilter };
};

// Resolve all schema functions in `model.authorize` so all leaves values
// are constants
const resolveSchemaFuncs = function ({ authorize, mInput }) {
  return recurseMap(
    authorize,
    schemaFunc => runSchemaFunc({ schemaFunc, mInput }),
  );
};

module.exports = {
  getAuthorizeMap,
};
