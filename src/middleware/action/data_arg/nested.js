'use strict';

const { assignArray, uniq } = require('../../../utilities');
const { getColl } = require('../get_coll');

const { getDataPath } = require('./data_path');
const { isObject } = require('./validate');

// Retrieve the keys of an `args.data` object which are nested collections
const getNestedKeys = function ({ data, commandpath, top, collsMap }) {
  const nestedKeys = data
    .map(Object.keys)
    .reduce(assignArray, []);
  const nestedKeysA = uniq(nestedKeys);
  // Keep only the keys which are nested collections
  const nestedKeysB = nestedKeysA
    .filter(attrName => isModel({ attrName, commandpath, top, collsMap }));
  return nestedKeysB;
};

const isModel = function ({ attrName, commandpath, top, collsMap }) {
  const commandpathA = [...commandpath, attrName];
  const coll = getColl({ top, collsMap, commandpath: commandpathA });
  return coll !== undefined && coll.collname !== undefined;
};

// Retrieve children actions of an `args.data` object by iterating over them
const getNestedActions = function ({ nestedKeys, ...rest }) {
  return nestedKeys
    .map(nestedKey => getNestedAction({ ...rest, nestedKey }))
    .reduce(assignArray, []);
};

const getNestedAction = function ({
  data,
  dataPaths,
  commandpath,
  top,
  collsMap,
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
    collsMap,
  });
};

// Retrieve nested data
const getData = function ({ data, nestedKey }) {
  return data
    .map(datum => datum[nestedKey])
    .reduce(assignArray, [])
    .filter(isObject);
};

// Add the `dataPaths` to the nested data, by adding `nestedKey` to each parent
// `dataPaths`
const getDataPaths = function ({ dataPaths, data, nestedKey }) {
  return dataPaths
    .map((dataPath, index) => getDataPath({
      data: data[index][nestedKey],
      commandpath: [...dataPath, nestedKey],
    }))
    .reduce(assignArray, []);
};

module.exports = {
  isModel,
  getNestedKeys,
  getNestedActions,
};
