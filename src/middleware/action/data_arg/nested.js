'use strict';

const { flatten, uniq } = require('../../../utilities');
const { getColl } = require('../get_coll');

const { getDataPath } = require('./data_path');
const { isModelType } = require('./validate');

// Retrieve the keys of an `args.data` object which are nested collections
const getNestedKeys = function ({ data, commandpath, top, schema }) {
  const nestedKeys = data.map(Object.keys);
  const nestedKeysA = flatten(nestedKeys);
  const nestedKeysB = uniq(nestedKeysA);
  // Keep only the keys which are nested collections
  const nestedKeysC = nestedKeysB
    .filter(attrName => isModel({ attrName, commandpath, top, schema }));
  return nestedKeysC;
};

const isModel = function ({ attrName, commandpath, top, schema }) {
  const commandpathA = [...commandpath, attrName];
  const coll = getColl({ top, schema, commandpath: commandpathA });
  return coll !== undefined && coll.collname !== undefined;
};

// Retrieve children actions of an `args.data` object by iterating over them
const getNestedActions = function ({ nestedKeys, ...rest }) {
  const nestedActions = nestedKeys
    .map(nestedKey => getNestedAction({ ...rest, nestedKey }));
  const nestedActionsA = flatten(nestedActions);
  return nestedActionsA;
};

const getNestedAction = function ({
  data,
  dataPaths,
  commandpath,
  top,
  schema,
  nestedKey,
  parseActions,
}) {
  const nestedCommandpath = [...commandpath, nestedKey];
  const nestedData = getData({ data, nestedKey });
  const nestedDataPaths = getDataPaths({ dataPaths, data, nestedKey });

  return parseActions({
    commandpath: nestedCommandpath,
    data: nestedData,
    dataPaths: nestedDataPaths,
    top,
    schema,
  });
};

// Retrieve nested data
const getData = function ({ data, nestedKey }) {
  const nestedData = data.map(datum => datum[nestedKey]);
  const nestedDataA = flatten(nestedData);
  const nestedDataB = nestedDataA.filter(isModelType);
  return nestedDataB;
};

// Add the `dataPaths` to the nested data, by adding `nestedKey` to each parent
// `dataPaths`
const getDataPaths = function ({ dataPaths, data, nestedKey }) {
  const dataPathsA = dataPaths.map((dataPath, index) => getDataPath({
    data: data[index][nestedKey],
    commandpath: [...dataPath, nestedKey],
  }));
  const dataPathsB = flatten(dataPathsA);
  return dataPathsB;
};

module.exports = {
  isModel,
  getNestedKeys,
  getNestedActions,
};
