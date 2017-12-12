'use strict';

const { uniq, pick, mapValues, intersection } = require('../../../utilities');
const { runConfigFunc } = require('../../../functions');
const { crawlNodes } = require('../../../filter');

// Retrieve all server-specific parameters used in `coll.authorize`, and
// resolve their config functions.
const getServerParams = function ({ authorize, serverParams, mInput }) {
  // Retrieve all `attrName` recursively inside filter AST
  const attrNames = crawlNodes(authorize, ({ attrName }) => attrName);
  const serverParamsNames = getPossibleServerParams({ attrNames, serverParams });
  const serverParamsA = pick(serverParams, serverParamsNames);
  const serverParamsB = mapValues(
    serverParamsA,
    configFunc => runConfigFunc({ configFunc, mInput }),
  );
  return serverParamsB;
};

// Only keep the `attrName` that targets a server-specific parameters
const getPossibleServerParams = function ({ attrNames, serverParams }) {
  const possibleServerParams = Object.keys(serverParams);
  const serverParamsNames = intersection(attrNames, possibleServerParams);
  const serverParamsNamesA = uniq(serverParamsNames);
  return serverParamsNamesA;
};

module.exports = {
  getServerParams,
};
