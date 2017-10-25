'use strict';

const { uniq } = require('lodash');

const {
  assignObject,
  assignArray,
  pick,
  omitBy,
  mapValues,
  recurseMap,
  fullRecurseMap,
} = require('../../utilities');
const { throwError } = require('../../error');
const { runSchemaFunc, getVars } = require('../../schema_func');
const { evalFilter } = require('../../database');

// Handles `model.authorize`
const validateAuthorization = function ({ actions, schema, userVars, mInput }) {
  const modelNames = getModelNames({ actions });
  const authorizeMap = getAuthorizeMap({ modelNames, schema, mInput });
  const userVarsA = getUserVars({ authorizeMap, userVars, mInput });
  const systemVars = getVars(mInput);
  const actionsA = actions.map(action => addAuthorizeFilter({
    action,
    authorizeMap,
    userVars: userVarsA,
    systemVars,
  }));
  return { actions: actionsA };
};

const getModelNames = function ({ actions }) {
  const modelNames = actions.map(({ modelName }) => modelName);
  const modelNamesA = uniq(modelNames);
  return modelNamesA;
};

const getAuthorizeMap = function ({ modelNames, schema, mInput }) {
  const modelNamesA = modelNames
    .map(modelName => ({ [modelName]: modelName }))
    .reduce(assignObject, {});
  const authorizeMap = mapValues(
    modelNamesA,
    modelName => getAuthorizeFilter({ modelName, schema, mInput }),
  );
  const authorizeMapA = omitBy(
    authorizeMap,
    authorizeFilter => authorizeFilter === undefined
  );
  return authorizeMapA;
};

const getAuthorizeFilter = function ({
  modelName,
  schema: { models },
  mInput,
}) {
  const model = models[modelName];
  const { authorize } = model;
  const authorizeA = resolveSchemaFuncs({ authorize, mInput });
  return authorizeA;
};

const resolveSchemaFuncs = function ({ authorize, mInput }) {
  return recurseMap(
    authorize,
    schemaFunc => runSchemaFunc({ schemaFunc, mInput }),
  );
};

const getUserVars = function ({ authorizeMap, userVars, mInput }) {
  const userVarsNames = getUserVarsNames({ authorizeMap, userVars });
  const userVarsA = pick(userVars, userVarsNames);
  const userVarsB = mapValues(
    userVarsA,
    schemaFunc => runSchemaFunc({ schemaFunc, mInput }),
  );
  return userVarsB;
};

const getUserVarsNames = function ({ authorizeMap, userVars }) {
  const { attrNames: userVarsNames } = fullRecurseMap(
    authorizeMap,
    recurseUserVarsNames,
  );
  const userVarsNamesA = getPossibleUserVars({ userVarsNames, userVars });
  const userVarsNamesB = uniq(userVarsNamesA);
  return userVarsNamesB;
};

const recurseUserVarsNames = function (obj, name) {
  if (name === 'attrName') {
    return { attrNames: [obj] };
  }

  if (typeof obj !== 'object') { return; }

  const attrNames = getAttrNames(obj);
  return { attrNames };
};

const getAttrNames = function (obj) {
  return Object.values(obj)
    .filter(value => value && Array.isArray(value.attrNames))
    .map(({ attrNames }) => attrNames)
    .reduce(assignArray, []);
};

const getPossibleUserVars = function ({ userVarsNames, userVars }) {
  const possibleUserVars = Object.keys(userVars);
  return userVarsNames.filter(name => possibleUserVars.includes(name));
};

const addAuthorizeFilter = function ({
  action,
  action: { modelName },
  authorizeMap,
  userVars,
  systemVars,
}) {
  const attrs = getFilterAttrs({ action, userVars, systemVars });
  const filter = authorizeMap[modelName];
  const authorizeFilter = evalFilter({
    filter,
    attrs,
    partialNames: PARTIAL_NAMES_REGEXP,
  });

  if (authorizeFilter === true) { return action; }

  if (authorizeFilter === false) {
    const message = `Accessing model '${modelName}' is not allowed`;
    throwError(message, { reason: 'AUTHORIZATION' });
  }

  return { ...action, authorizeFilter };
};

// `$model.*` is transformed to `authorizeFilter`, which is added to
// `args.filter` and checked against `args.data`
const PARTIAL_NAMES_REGEXP = /\$model\./;

const getFilterAttrs = function ({
  action: { modelName, command },
  userVars,
  systemVars,
}) {
  return {
    ...userVars,
    ...systemVars,
    $command: command.type,
    $modelName: modelName,
  };
};

module.exports = {
  validateAuthorization,
};
