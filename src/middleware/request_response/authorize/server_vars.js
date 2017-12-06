'use strict';

const { uniq, pick, mapValues, intersection } = require('../../../utilities');
const { runSchemaFunc } = require('../../../functions');
const { crawlNodes } = require('../../../filter');

// Retrieve all server-specific variables used in `coll.authorize`, and
// resolve their schema functions.
const getServerVars = function ({ authorize, serverVars, mInput }) {
  // Retrieve all `attrName` recursively inside filter AST
  const attrNames = crawlNodes(authorize, ({ attrName }) => attrName);
  const serverVarsNames = getPossibleServerVars({ attrNames, serverVars });
  const serverVarsA = pick(serverVars, serverVarsNames);
  const serverVarsB = mapValues(
    serverVarsA,
    schemaFunc => runSchemaFunc({ schemaFunc, mInput }),
  );
  return serverVarsB;
};

// Only keep the `attrName` that targets a server-specific variable
const getPossibleServerVars = function ({ attrNames, serverVars }) {
  const possibleServerVars = Object.keys(serverVars);
  const serverVarsNames = intersection(attrNames, possibleServerVars);
  const serverVarsNamesA = uniq(serverVarsNames);
  return serverVarsNamesA;
};

module.exports = {
  getServerVars,
};
