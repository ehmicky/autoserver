'use strict';

const { uniq, intersection } = require('lodash');

const {
  assignArray,
  pick,
  mapValues,
  fullRecurseMap,
} = require('../../../utilities');
const { runSchemaFunc } = require('../../../schema_func');

// Retrieve all user variables used inside any `model.authorize` used in
// the current operation, and resolve their schema functions.
const getUserVars = function ({ authorizeMap, userVars, mInput }) {
  const userVarsNames = getUserVarsNames({ authorizeMap, userVars });
  const userVarsA = pick(userVars, userVarsNames);
  const userVarsB = mapValues(
    userVarsA,
    schemaFunc => runSchemaFunc({ schemaFunc, mInput }),
  );
  return userVarsB;
};

// Retrieve the names of all user variables used inside any `model.authorize`
// used in the current operation
const getUserVarsNames = function ({ authorizeMap, userVars }) {
  const { attrNames: userVarsNames } = fullRecurseMap(
    authorizeMap,
    recurseUserVarsNames,
  );
  const userVarsNamesA = getPossibleUserVars({ userVarsNames, userVars });
  const userVarsNamesB = uniq(userVarsNamesA);
  return userVarsNamesB;
};

// Retrieve all `attrName` recursively inside filter AST
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

// Only keep the `attrName` that targets a user variable
const getPossibleUserVars = function ({ userVarsNames, userVars }) {
  const possibleUserVars = Object.keys(userVars);
  return intersection(userVarsNames, possibleUserVars);
};

module.exports = {
  getUserVars,
};
