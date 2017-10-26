'use strict';

const { uniq, intersection } = require('lodash');

const {
  assignArray,
  pick,
  mapValues,
  fullRecurseMap,
} = require('../../../utilities');
const { runSchemaFunc } = require('../../../schema_func');

// Retrieve all user variables used in `model.authorize`, and resolve their
// schema functions.
const getUserVars = function ({ authorize, userVars, mInput }) {
  const userVarsNames = getUserVarsNames({ authorize, userVars });
  const userVarsA = pick(userVars, userVarsNames);
  const userVarsB = mapValues(
    userVarsA,
    schemaFunc => runSchemaFunc({ schemaFunc, mInput }),
  );
  return userVarsB;
};

// Retrieve the names of all user variables used in `model.authorize`
const getUserVarsNames = function ({ authorize, userVars }) {
  const { attrNames: userVarsNames } = fullRecurseMap(
    authorize,
    recurseUserVarsNames,
  );
  const userVarsNamesA = getPossibleUserVars({ userVarsNames, userVars });
  return userVarsNamesA;
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
  const userVarsNamesA = intersection(userVarsNames, possibleUserVars);
  const userVarsNamesB = uniq(userVarsNamesA);
  return userVarsNamesB;
};

module.exports = {
  getUserVars,
};
